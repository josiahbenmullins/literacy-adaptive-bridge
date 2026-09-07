#!/usr/bin/env python3
"""
Repair Standard English glosses in the GNT Reader vocabulary data.

LOCAL-ONLY:
- Reads the pinned OpenGNT CSV named by SOURCE_MANIFEST.json
- Makes no network requests
- Rewrites only vocabulary gloss data
- Does not touch React/Next.js source files
"""

from __future__ import annotations

from collections import Counter, defaultdict
import csv
import hashlib
import json
from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
VENDOR_DIR = ROOT / "source_data" / "vendor" / "opengnt"
MANIFEST_PATH = VENDOR_DIR / "SOURCE_MANIFEST.json"
SOURCE_VOCAB = ROOT / "source_data" / "vocabulary.json"
PUBLIC_VOCAB = ROOT / "public" / "data" / "vocabulary.json"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def strip_group(value: str) -> str:
    value = value.strip()
    if value.startswith("〔") and value.endswith("〕"):
        return value[1:-1]
    return value


def split_group(value: str) -> list[str]:
    value = strip_group(value)

    # OpenGNT uses the full-width vertical bar, but accept normal | too.
    if "｜" in value:
        return [part.strip() for part in value.split("｜")]
    if "|" in value:
        return [part.strip() for part in value.split("|")]
    return [value.strip()]


def normalize_gloss(value: str) -> str:
    value = value.strip()
    value = value.replace("[", "").replace("]", "")
    value = re.sub(r"<[^>]*>", "", value)
    return " ".join(value.split())


def locate_column(headers: list[str], term: str) -> int:
    for index, header in enumerate(headers):
        if term in header:
            return index
    raise RuntimeError(
        f"Could not find a local OpenGNT column containing {term!r}.\n"
        "Headers found:\n"
        + "\n".join(f"{i + 1}: {h}" for i, h in enumerate(headers))
    )


def load_pinned_source() -> tuple[dict, Path]:
    if not MANIFEST_PATH.exists():
        raise RuntimeError(
            f"Missing manifest: {MANIFEST_PATH}\n"
            "The pinned OpenGNT source must already exist locally."
        )

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    pinned_name = manifest.get("pinnedFile")
    if not pinned_name:
        raise RuntimeError("SOURCE_MANIFEST.json has no 'pinnedFile' value.")

    source = VENDOR_DIR / pinned_name
    if not source.exists():
        raise RuntimeError(f"Pinned local CSV not found: {source}")

    expected = manifest.get("pinnedFileSha256")
    if expected:
        actual = sha256_file(source)
        if actual != expected:
            raise RuntimeError(
                "Pinned OpenGNT checksum mismatch.\n"
                f"Expected: {expected}\n"
                f"Actual:   {actual}"
            )

    return manifest, source


def extract_glosses(source: Path) -> tuple[dict[str, str], dict]:
    """
    Return lemma -> most common non-empty TBESG gloss.

    This deliberately reads by numeric column index from the actual local
    header rather than relying on a particular OpenGNT revision's exact
    DictReader keys.
    """
    gloss_counts: dict[str, Counter[str]] = defaultdict(Counter)
    stats = {
        "rows": 0,
        "rows_with_gloss": 0,
        "translation_header": "",
        "translation_parts": [],
        "samples": [],
    }

    with source.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.reader(handle, delimiter="\t")
        try:
            headers = [cell.strip() for cell in next(reader)]
        except StopIteration as exc:
            raise RuntimeError("Pinned OpenGNT CSV is empty.") from exc

        greek_col = locate_column(headers, "lexeme")
        translation_col = locate_column(headers, "TBESG")

        greek_header_parts = split_group(headers[greek_col])
        translation_header_parts = split_group(headers[translation_col])

        stats["translation_header"] = headers[translation_col]
        stats["translation_parts"] = translation_header_parts

        try:
            lemma_index = greek_header_parts.index("lexeme")
        except ValueError as exc:
            raise RuntimeError(
                "Found the Greek grouped column, but could not locate "
                f"'lexeme' inside it: {greek_header_parts!r}"
            ) from exc

        try:
            tbesg_index = translation_header_parts.index("TBESG")
        except ValueError:
            # Documented OpenGNT layout puts TBESG first.
            tbesg_index = 0

        for row_number, record in enumerate(reader, start=2):
            if not record:
                continue

            if len(record) <= max(greek_col, translation_col):
                continue

            greek_parts = split_group(record[greek_col])
            translation_raw = record[translation_col]
            translation_parts = split_group(translation_raw)

            if lemma_index >= len(greek_parts):
                continue

            lemma = greek_parts[lemma_index].strip()
            if not lemma:
                continue

            gloss_raw = (
                translation_parts[tbesg_index]
                if tbesg_index < len(translation_parts)
                else ""
            )
            gloss = normalize_gloss(gloss_raw)

            stats["rows"] += 1
            if len(stats["samples"]) < 8:
                stats["samples"].append(
                    {
                        "row": row_number,
                        "lemma": lemma,
                        "raw_translation_cell": translation_raw,
                        "split_translation": translation_parts,
                        "gloss": gloss,
                    }
                )

            if gloss:
                stats["rows_with_gloss"] += 1
                gloss_counts[lemma][gloss] += 1

    if not gloss_counts:
        raise RuntimeError(
            "ZERO TBESG glosses were found in the pinned local CSV.\n\n"
            f"Translation header:\n  {stats['translation_header']!r}\n"
            f"Header split:\n  {stats['translation_parts']!r}\n"
            f"First local samples:\n"
            + "\n".join(
                f"  row {s['row']}: lemma={s['lemma']!r}, "
                f"cell={s['raw_translation_cell']!r}, "
                f"split={s['split_translation']!r}"
                for s in stats["samples"]
            )
        )

    selected: dict[str, str] = {}
    for lemma, counts in gloss_counts.items():
        selected[lemma] = sorted(
            counts.items(),
            key=lambda item: (-item[1], len(item[0]), item[0].casefold()),
        )[0][0]

    return selected, stats


def repair_vocab(path: Path, glosses: dict[str, str]) -> tuple[int, int]:
    if not path.exists():
        raise RuntimeError(f"Vocabulary file not found: {path}")

    payload = json.loads(path.read_text(encoding="utf-8"))
    lemmas = payload.get("lemmas")
    if not isinstance(lemmas, list):
        raise RuntimeError(f"Unexpected vocabulary format in {path}")

    matched = 0
    missing = 0

    for entry in lemmas:
        lemma = entry.get("lemma", "")
        gloss = glosses.get(lemma, "")
        entry["gloss"] = gloss
        # Also emit an explicit alias for future UI/data clarity.
        entry["standardEnglish"] = gloss

        if gloss:
            matched += 1
        else:
            missing += 1

    payload["glossMetric"] = (
        "TBESG context-insensitive standard English gloss "
        "from pinned local OpenGNT source"
    )

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    return matched, missing


def main() -> int:
    print("GNT vocabulary local-gloss repair")
    print("---------------------------------")

    manifest, source = load_pinned_source()
    print(f"Pinned source: {source}")
    print("Network access: none")

    glosses, stats = extract_glosses(source)

    print(f"Parsed local word rows: {stats['rows']:,}")
    print(
        "Rows with TBESG gloss: "
        f"{stats['rows_with_gloss']:,}"
    )
    print(f"Unique lemmas with a gloss: {len(glosses):,}")

    source_match, source_missing = repair_vocab(SOURCE_VOCAB, glosses)
    public_match, public_missing = repair_vocab(PUBLIC_VOCAB, glosses)

    print()
    print("Repaired:")
    print(
        f"  source_data/vocabulary.json: "
        f"{source_match:,} glossed, {source_missing:,} blank"
    )
    print(
        f"  public/data/vocabulary.json: "
        f"{public_match:,} glossed, {public_missing:,} blank"
    )

    # Print real examples from the repaired vocabulary so the result is
    # inspectable before Next.js is started.
    public_payload = json.loads(PUBLIC_VOCAB.read_text(encoding="utf-8"))
    wanted = {"λόγος", "θεός", "ἀγάπη", "Ἰησοῦς", "ἀρχή"}
    examples = [
        entry
        for entry in public_payload["lemmas"]
        if entry.get("lemma") in wanted
    ]

    if not examples:
        examples = [
            entry
            for entry in public_payload["lemmas"]
            if entry.get("gloss")
        ][:8]

    print()
    print("Examples written to public/data/vocabulary.json:")
    for entry in examples:
        print(
            f"  {entry.get('lemma')} -> "
            f"{entry.get('gloss')!r} "
            f"({entry.get('frequency')}x)"
        )

    if public_match == 0:
        raise RuntimeError(
            "Repair found local glosses, but matched zero vocabulary lemmas. "
            "That indicates a lemma-normalization mismatch."
        )

    print()
    print("SUCCESS: local vocabulary gloss data is populated.")
    print("Now restart `npm run dev` and refresh /vocabulary.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print()
        print("ERROR:")
        print(exc)
        raise SystemExit(1)
