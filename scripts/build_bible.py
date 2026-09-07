#!/usr/bin/env python3
"""
Build app-ready Scripture data strictly from pinned LOCAL OpenGNT + TBESG sources.

No network access is used.

Current build target:
- Complete New Testament (27 books / 260 chapters)

For each aligned token, the compiler writes:
- accented Greek surface form
- lemma
- SBL transliteration
- Extended Strong's number
- Robinson morphology code
- contextual Berean-derived English for that occurrence
- full-New-Testament lemma frequency
- sanitized punctuation

It also builds a compact lexical index keyed by Extended Strong's number.
Reusable lexical-reference metadata (BDAG / EDNT / Mounce / GK /
Louw-Nida lookup identifiers) and STEPBible TBESG brief definitions are
stored once there instead of being duplicated into every chapter token.

It also regenerates the local vocabulary file with the TBESG
context-insensitive Standard English gloss.

The runtime app performs no linguistic analysis and makes no source downloads.
"""

from __future__ import annotations

from collections import Counter, defaultdict
import csv
import hashlib
import html
import json
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
VENDOR_DIR = ROOT / "source_data" / "vendor" / "opengnt"
MANIFEST_PATH = VENDOR_DIR / "SOURCE_MANIFEST.json"
TBESG_VENDOR_DIR = ROOT / "source_data" / "vendor" / "stepbible" / "tbesg"
TBESG_MANIFEST_PATH = TBESG_VENDOR_DIR / "SOURCE_MANIFEST.json"
PUBLIC_DATA = ROOT / "public" / "data"
SOURCE_DATA = ROOT / "source_data"

# Protestant-canon book numbers used by the pinned OpenGNT source.
# These codes match the Next.js navigation in src/lib/bible.ts.
NT_BOOKS = [
    {"bookNumber": 40, "bookCode": "MAT", "bookName": "Matthew", "chapters": 28},
    {"bookNumber": 41, "bookCode": "MRK", "bookName": "Mark", "chapters": 16},
    {"bookNumber": 42, "bookCode": "LUK", "bookName": "Luke", "chapters": 24},
    {"bookNumber": 43, "bookCode": "JHN", "bookName": "John", "chapters": 21},
    {"bookNumber": 44, "bookCode": "ACT", "bookName": "Acts", "chapters": 28},
    {"bookNumber": 45, "bookCode": "ROM", "bookName": "Romans", "chapters": 16},
    {"bookNumber": 46, "bookCode": "1CO", "bookName": "1 Corinthians", "chapters": 16},
    {"bookNumber": 47, "bookCode": "2CO", "bookName": "2 Corinthians", "chapters": 13},
    {"bookNumber": 48, "bookCode": "GAL", "bookName": "Galatians", "chapters": 6},
    {"bookNumber": 49, "bookCode": "EPH", "bookName": "Ephesians", "chapters": 6},
    {"bookNumber": 50, "bookCode": "PHP", "bookName": "Philippians", "chapters": 4},
    {"bookNumber": 51, "bookCode": "COL", "bookName": "Colossians", "chapters": 4},
    {"bookNumber": 52, "bookCode": "1TH", "bookName": "1 Thessalonians", "chapters": 5},
    {"bookNumber": 53, "bookCode": "2TH", "bookName": "2 Thessalonians", "chapters": 3},
    {"bookNumber": 54, "bookCode": "1TI", "bookName": "1 Timothy", "chapters": 6},
    {"bookNumber": 55, "bookCode": "2TI", "bookName": "2 Timothy", "chapters": 4},
    {"bookNumber": 56, "bookCode": "TIT", "bookName": "Titus", "chapters": 3},
    {"bookNumber": 57, "bookCode": "PHM", "bookName": "Philemon", "chapters": 1},
    {"bookNumber": 58, "bookCode": "HEB", "bookName": "Hebrews", "chapters": 13},
    {"bookNumber": 59, "bookCode": "JAS", "bookName": "James", "chapters": 5},
    {"bookNumber": 60, "bookCode": "1PE", "bookName": "1 Peter", "chapters": 5},
    {"bookNumber": 61, "bookCode": "2PE", "bookName": "2 Peter", "chapters": 3},
    {"bookNumber": 62, "bookCode": "1JN", "bookName": "1 John", "chapters": 5},
    {"bookNumber": 63, "bookCode": "2JN", "bookName": "2 John", "chapters": 1},
    {"bookNumber": 64, "bookCode": "3JN", "bookName": "3 John", "chapters": 1},
    {"bookNumber": 65, "bookCode": "JUD", "bookName": "Jude", "chapters": 1},
    {"bookNumber": 66, "bookCode": "REV", "bookName": "Revelation", "chapters": 22},
]

EXPECTED_BOOK_COUNT = 27
EXPECTED_CHAPTER_COUNT = 260



def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()



_STRONGS_KEY_RE = re.compile(r"^G0*(\d+)([A-Za-z]*)$")
_BR_RE = re.compile(r"<br\s*/?>", re.IGNORECASE)
_TAG_RE = re.compile(r"<[^>]+>")
_WS_RE = re.compile(r"\s+")


def normalize_strongs_key(value: str) -> str:
    """Normalize G03056 / G3056 / G03056A to compact lookup keys."""
    value = value.strip()
    match = _STRONGS_KEY_RE.match(value)
    if not match:
        return value
    suffix = match.group(2) or ""
    return f"G{int(match.group(1))}{suffix}"


def strip_lexicon_html(value: str) -> str:
    """Convert STEPBible TBESG's compact HTML definition to readable text."""
    text = _BR_RE.sub(" ", value)
    text = _TAG_RE.sub("", text)
    text = html.unescape(text)
    text = text.replace("__", "")
    return _WS_RE.sub(" ", text).strip()


def load_tbesg_source() -> tuple[dict, Path]:
    if not TBESG_MANIFEST_PATH.exists():
        raise SystemExit(
            "No pinned TBESG lexicon exists.\n"
            "Run first:\n"
            "    python3 scripts/pin_tbesg.py"
        )

    manifest = json.loads(
        TBESG_MANIFEST_PATH.read_text(encoding="utf-8")
    )
    source_path = TBESG_VENDOR_DIR / manifest["pinnedFile"]

    if not source_path.exists():
        raise RuntimeError(
            f"Pinned TBESG source missing: {source_path}"
        )

    expected_sha = manifest.get("pinnedFileSha256")
    if expected_sha:
        actual_sha = sha256_file(source_path)
        if actual_sha != expected_sha:
            raise RuntimeError(
                "Pinned TBESG checksum does not match SOURCE_MANIFEST.json.\n"
                f"Expected: {expected_sha}\n"
                f"Actual:   {actual_sha}"
            )

    return manifest, source_path


def parse_tbesg(source_path: Path) -> dict[str, dict]:
    """
    Parse the pinned STEPBible TBESG lexicon. Data rows are tab-separated:
    eStrong | dStrong | uStrong | Greek | Transliteration | Morph | Gloss | Meaning

    Each row is indexed under all available Strong's identifiers so OpenGNT's
    Extended Strong's value can resolve without duplicating definitions per token.
    """
    entries: dict[str, dict] = {}
    data_rows = 0

    for line in source_path.read_text(encoding="utf-8-sig").splitlines():
        columns = line.split("\t")
        if len(columns) < 8:
            continue

        e_strong = normalize_strongs_key(columns[0])
        if not _STRONGS_KEY_RE.match(columns[0].strip()):
            continue

        data_rows += 1
        d_strong = normalize_strongs_key(columns[1])
        u_strong = normalize_strongs_key(columns[2])

        entry = {
            "strongs": e_strong,
            "lemma": columns[3].strip(),
            "transliteration": columns[4].strip(),
            "gloss": columns[6].strip(),
            "definition": strip_lexicon_html(columns[7]),
        }

        for key in (e_strong, d_strong, u_strong):
            if key and key.startswith("G") and key not in entries:
                entries[key] = entry

    if data_rows == 0 or not entries:
        raise RuntimeError(
            "Pinned TBESG file was found but no lexicon rows could be parsed."
        )

    print(
        "Parsed TBESG lexicon: "
        f"{data_rows:,} rows / {len(entries):,} lookup keys"
    )
    return entries


def strip_group(value: str) -> str:
    value = value.strip()
    if value.startswith("〔") and value.endswith("〕"):
        return value[1:-1]
    return value


def split_group(value: str) -> list[str]:
    value = strip_group(value)

    # OpenGNT normally uses the full-width divider; accept ASCII | too.
    if "｜" in value:
        return [part.strip() for part in value.split("｜")]
    if "|" in value:
        return [part.strip() for part in value.split("|")]
    return [value.strip()]


def find_column(headers: list[str], *required_terms: str) -> int:
    for index, header in enumerate(headers):
        if all(term in header for term in required_terms):
            return index

    raise RuntimeError(
        "Could not locate OpenGNT column containing "
        f"{required_terms}. Actual local headers:\n"
        + "\n".join(
            f"{i + 1}: {header}"
            for i, header in enumerate(headers)
        )
    )


def normalize_contextual_english(raw: str) -> str:
    """
    Preserve the source wording and its own sentence punctuation while
    removing editorial/source-structure markers that should not be displayed.
    """
    value = raw.strip().replace("[", "").replace("]", "")

    # Paragraph / section markers are source-layout metadata, not Scripture.
    value = re.sub(r"[¶§❡⸿]", "", value)

    # Remove any XML/HTML-like metadata tags if they occur in this field.
    value = re.sub(r"<[^>]*>", "", value)

    return " ".join(value.split())


def normalize_vocab_gloss(raw: str) -> str:
    value = raw.strip().replace("[", "").replace("]", "")
    value = re.sub(r"<[^>]*>", "", value)
    return " ".join(value.split())


def sanitize_punctuation(raw: str) -> str:
    """
    Remove OpenGNT display/layout metadata while keeping real punctuation.

    Markers such as <pm>, ¶, §, ❡, and ⸿ describe paragraph/layout structure
    and should never appear as visible biblical punctuation.
    """
    value = raw.strip()
    value = re.sub(r"<[^>]*>", "", value)
    value = re.sub(r"[¶§❡⸿]", "", value)
    return value.strip()


def assert_no_display_markup(
    value: str,
    *,
    field: str,
    token_id: str,
) -> None:
    if re.search(r"<[^>]*>", value):
        raise RuntimeError(
            f"Display metadata leaked into {field} for "
            f"{token_id}: {value!r}"
        )


def parse_reference(value: str) -> tuple[int, int, int]:
    parts = split_group(value)
    if len(parts) < 3:
        raise ValueError(value)
    return int(parts[0]), int(parts[1]), int(parts[2])


def load_manifest_and_source() -> tuple[dict, Path]:
    if not MANIFEST_PATH.exists():
        raise SystemExit(
            "No pinned OpenGNT source manifest exists.\n"
            "Run first:\n"
            "    npm run data:pin"
        )

    manifest = json.loads(
        MANIFEST_PATH.read_text(encoding="utf-8")
    )

    source_path = VENDOR_DIR / manifest["pinnedFile"]

    if not source_path.exists():
        raise RuntimeError(
            f"Pinned local OpenGNT source missing: {source_path}"
        )

    expected_sha = manifest.get("pinnedFileSha256")
    if expected_sha:
        actual_sha = sha256_file(source_path)
        if actual_sha != expected_sha:
            raise RuntimeError(
                "Pinned OpenGNT checksum does not match "
                "SOURCE_MANIFEST.json.\n"
                f"Expected: {expected_sha}\n"
                f"Actual:   {actual_sha}"
            )

    return manifest, source_path


def parse_rows(source_path: Path) -> list[dict]:
    """
    Parse the actual pinned local OpenGNT header rather than assuming a
    particular upstream revision.
    """
    rows: list[dict] = []

    with source_path.open(
        "r",
        encoding="utf-8-sig",
        newline="",
    ) as handle:
        reader = csv.reader(handle, delimiter="\t")

        try:
            headers = [
                value.strip()
                for value in next(reader)
            ]
        except StopIteration as exc:
            raise RuntimeError(
                "Pinned OpenGNT source is empty."
            ) from exc

        reference_column = find_column(
            headers,
            "Book",
            "Chapter",
            "Verse",
        )
        greek_column = find_column(
            headers,
            "OGNTa",
            "lexeme",
        )
        lexicon_reference_column = find_column(
            headers,
            "BDAGentry",
            "LN-LouwNidaNumbers",
        )
        translation_column = find_column(
            headers,
            "TBESG",
        )
        transliteration_column = find_column(
            headers,
            "transSBL",
        )
        punctuation_column = find_column(
            headers,
            "PMpWord",
            "PMfWord",
        )

        greek_names = split_group(
            headers[greek_column]
        )
        lexicon_reference_names = split_group(
            headers[lexicon_reference_column]
        )
        translation_names = split_group(
            headers[translation_column]
        )
        transliteration_names = split_group(
            headers[transliteration_column]
        )
        punctuation_names = split_group(
            headers[punctuation_column]
        )

        try:
            greek_index = greek_names.index("OGNTa")
            lemma_index = greek_names.index("lexeme")
            strongs_index = greek_names.index("sn")
            rmac_index = greek_names.index("rmac")
        except ValueError as exc:
            raise RuntimeError(
                "Could not identify OGNTa / lexeme / sn / rmac within "
                f"local Greek header: "
                f"{headers[greek_column]!r}"
            ) from exc

        reference_slots = {
            "bdag": "BDAGentry",
            "ednt": "EDNTentry",
            "mounce": "MounceEntry",
            "gk": "GoodrickKohlenbergerNumbers",
            "louwNida": "LN-LouwNidaNumbers",
        }

        reference_indexes: dict[str, int] = {}
        for key, slot_name in reference_slots.items():
            try:
                reference_indexes[key] = (
                    lexicon_reference_names.index(slot_name)
                )
            except ValueError:
                # Missing optional lookup references should not block
                # the Scripture build.
                continue

        try:
            standard_gloss_index = (
                translation_names.index("TBESG")
            )
        except ValueError:
            # Documented OpenGNT layout puts TBESG first.
            standard_gloss_index = 0

        # Prefer the capitalization-preserving SBL transliteration.
        # Fall back to the lowercase SBL field if needed.
        if "transSBLcap" in transliteration_names:
            transliteration_index = transliteration_names.index(
                "transSBLcap"
            )
        elif "transSBL" in transliteration_names:
            transliteration_index = transliteration_names.index(
                "transSBL"
            )
        else:
            raise RuntimeError(
                "Could not identify SBL transliteration slot in "
                f"{headers[transliteration_column]!r}"
            )

        # The contextual Berean-derived interlinear slot is named IT in
        # documentation and BIB in some pinned header revisions.
        if "IT" in translation_names:
            english_index = translation_names.index("IT")
        elif "BIB" in translation_names:
            english_index = translation_names.index("BIB")
        elif len(translation_names) >= 2:
            english_index = 1
        else:
            raise RuntimeError(
                "Could not identify contextual English slot in "
                f"{headers[translation_column]!r}"
            )

        try:
            punctuation_before_index = (
                punctuation_names.index("PMpWord")
            )
            punctuation_after_index = (
                punctuation_names.index("PMfWord")
            )
        except ValueError as exc:
            raise RuntimeError(
                "Could not identify punctuation fields in "
                f"{headers[punctuation_column]!r}"
            ) from exc

        rows_with_gloss = 0

        for source_line, record in enumerate(
            reader,
            start=2,
        ):
            if not record:
                continue

            if len(record) < len(headers):
                record = record + [""] * (
                    len(headers) - len(record)
                )

            ref_value = record[
                reference_column
            ].strip()

            if not ref_value:
                continue

            try:
                book, chapter, verse = (
                    parse_reference(ref_value)
                )
            except (ValueError, IndexError):
                continue

            greek_parts = split_group(
                record[greek_column]
            )
            lexicon_reference_parts = split_group(
                record[lexicon_reference_column]
            )
            translation_parts = split_group(
                record[translation_column]
            )
            transliteration_parts = split_group(
                record[transliteration_column]
            )
            punctuation_parts = split_group(
                record[punctuation_column]
            )

            if max(
                greek_index,
                lemma_index,
                strongs_index,
                rmac_index,
            ) >= len(greek_parts):
                raise RuntimeError(
                    "Malformed Greek field at "
                    f"source line {source_line}"
                )

            greek = greek_parts[
                greek_index
            ].strip()
            lemma = greek_parts[
                lemma_index
            ].strip()
            strongs = greek_parts[
                strongs_index
            ].strip()
            morphology_code = greek_parts[
                rmac_index
            ].strip()

            if not greek or not lemma:
                raise RuntimeError(
                    "Missing accented Greek or lemma "
                    f"at source line {source_line}"
                )

            lexical_refs = {
                key: (
                    lexicon_reference_parts[index].strip()
                    if index < len(lexicon_reference_parts)
                    else ""
                )
                for key, index in reference_indexes.items()
            }

            transliteration = (
                transliteration_parts[
                    transliteration_index
                ].strip()
                if transliteration_index
                < len(transliteration_parts)
                else ""
            )

            standard_gloss_raw = (
                translation_parts[
                    standard_gloss_index
                ].strip()
                if standard_gloss_index
                < len(translation_parts)
                else ""
            )
            standard_gloss = (
                normalize_vocab_gloss(
                    standard_gloss_raw
                )
            )

            if standard_gloss:
                rows_with_gloss += 1

            english_raw = (
                translation_parts[
                    english_index
                ].strip()
                if english_index
                < len(translation_parts)
                else ""
            )
            english = (
                normalize_contextual_english(
                    english_raw
                )
            )

            punctuation_before_raw = (
                punctuation_parts[
                    punctuation_before_index
                ]
                if punctuation_before_index
                < len(punctuation_parts)
                else ""
            )
            punctuation_after_raw = (
                punctuation_parts[
                    punctuation_after_index
                ]
                if punctuation_after_index
                < len(punctuation_parts)
                else ""
            )

            rows.append({
                "book": book,
                "chapter": chapter,
                "verse": verse,
                "greek": greek,
                "lemma": lemma,
                "transliteration": transliteration,
                "strongs": strongs,
                "morphologyCode": morphology_code,
                "lexicalRefs": lexical_refs,
                "standardGloss": standard_gloss,
                "standardGlossRaw": (
                    standard_gloss_raw
                ),
                "english": english,
                "englishRaw": english_raw,
                "punctuationBefore": (
                    sanitize_punctuation(
                        punctuation_before_raw
                    )
                ),
                "punctuationAfter": (
                    sanitize_punctuation(
                        punctuation_after_raw
                    )
                ),
                "punctuationBeforeRaw": (
                    punctuation_before_raw
                ),
                "punctuationAfterRaw": (
                    punctuation_after_raw
                ),
                "sourceLine": source_line,
            })

    if not rows:
        raise RuntimeError(
            "No OpenGNT word rows were parsed."
        )

    if rows_with_gloss == 0:
        raise RuntimeError(
            "Parsed the pinned local OpenGNT source "
            "but extracted zero TBESG glosses. "
            "Refusing to overwrite vocabulary.json."
        )

    print(
        "Local TBESG extraction: "
        f"{rows_with_gloss:,} word rows "
        "contain a standard gloss"
    )

    return rows


def write_json(
    path: Path,
    payload: dict | list,
) -> None:
    path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )
    path.write_text(
        json.dumps(
            payload,
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


def build_vocabulary(
    rows: list[dict],
    manifest: dict,
) -> Counter:
    frequency = Counter(
        row["lemma"]
        for row in rows
    )

    gloss_counts: dict[
        str,
        Counter[str],
    ] = defaultdict(Counter)

    for row in rows:
        gloss = row["standardGloss"]
        if gloss:
            gloss_counts[
                row["lemma"]
            ][gloss] += 1

    gloss_by_lemma: dict[
        str,
        str,
    ] = {}

    for lemma in frequency:
        candidates = gloss_counts.get(
            lemma
        )

        if not candidates:
            gloss_by_lemma[lemma] = ""
            continue

        selected = sorted(
            candidates.items(),
            key=lambda item: (
                -item[1],
                len(item[0]),
                item[0].casefold(),
            ),
        )[0][0]

        gloss_by_lemma[lemma] = selected

    glossed_lemma_count = sum(
        1
        for gloss in gloss_by_lemma.values()
        if gloss
    )

    if glossed_lemma_count == 0:
        raise RuntimeError(
            "Vocabulary build produced zero "
            "lemma glosses."
        )

    vocabulary = {
        "metric": (
            "New Testament lemma frequency"
        ),
        "glossMetric": (
            "TBESG context-insensitive standard "
            "English gloss from pinned local "
            "OpenGNT source"
        ),
        "source": manifest["pinnedFile"],
        "sourceSha256": manifest[
            "pinnedFileSha256"
        ],
        "totalTokens": len(rows),
        "totalLemmas": len(frequency),
        "lemmas": [
            {
                "lemma": lemma,
                "gloss": (
                    gloss_by_lemma[lemma]
                ),
                # Keep this alias because some UI
                # components can consume either name.
                "standardEnglish": (
                    gloss_by_lemma[lemma]
                ),
                "frequency": count,
            }
            for lemma, count in sorted(
                frequency.items(),
                key=lambda item: (
                    -item[1],
                    item[0],
                ),
            )
        ],
    }

    write_json(
        SOURCE_DATA / "vocabulary.json",
        vocabulary,
    )
    write_json(
        PUBLIC_DATA / "vocabulary.json",
        vocabulary,
    )

    print(
        f"Computed vocabulary: "
        f"{len(frequency):,} lemmas"
    )
    print(
        "Attached local TBESG standard English "
        f"glosses: {glossed_lemma_count:,} of "
        f"{len(frequency):,} lemmas"
    )

    return frequency



def _select_common_nonempty(
    values: list[str],
) -> str:
    candidates = Counter(
        value
        for value in values
        if value
    )
    if not candidates:
        return ""

    return sorted(
        candidates.items(),
        key=lambda item: (
            -item[1],
            len(item[0]),
            item[0].casefold(),
        ),
    )[0][0]


def build_lexical_index(
    rows: list[dict],
    manifest: dict,
    tbesg_manifest: dict,
    tbesg_entries: dict[str, dict],
) -> None:
    """
    Store reusable lexical metadata once per OpenGNT Extended Strong's
    identifier rather than duplicating it into every chapter token.

    Morphology deliberately does NOT live here: it describes the individual
    inflected occurrence and therefore remains on the chapter token as the
    compact RMAC code.

    TBESG's lexicon definition/gloss is joined here at build time and remains
    completely local at runtime.
    """
    grouped: dict[str, list[dict]] = defaultdict(list)

    for row in rows:
        strongs = row["strongs"]
        if strongs:
            grouped[strongs].append(row)

    entries: dict[str, dict] = {}
    lexical_matches = 0

    for strongs, strong_rows in sorted(grouped.items()):
        normalized_strongs = normalize_strongs_key(strongs)
        base_match = _STRONGS_KEY_RE.match(normalized_strongs)
        base_strongs = (
            f"G{int(base_match.group(1))}"
            if base_match
            else normalized_strongs
        )

        lexicon_entry = (
            tbesg_entries.get(normalized_strongs)
            or tbesg_entries.get(base_strongs)
        )

        entry = {
            "strongs": strongs,
            "lemma": _select_common_nonempty([
                row["lemma"]
                for row in strong_rows
            ]),
        }

        if lexicon_entry:
            lexical_matches += 1
            if lexicon_entry.get("gloss"):
                entry["lexiconGloss"] = lexicon_entry["gloss"]
            if lexicon_entry.get("definition"):
                entry["definition"] = lexicon_entry["definition"]
            if lexicon_entry.get("transliteration"):
                entry["lexiconTransliteration"] = lexicon_entry["transliteration"]

        for ref_key in (
            "bdag",
            "ednt",
            "mounce",
            "gk",
            "louwNida",
        ):
            selected = _select_common_nonempty([
                row["lexicalRefs"].get(ref_key, "")
                for row in strong_rows
            ])
            if selected:
                entry[ref_key] = selected

        entries[strongs] = entry

    coverage = (lexical_matches / len(entries)) if entries else 0.0

    payload = {
        "metric": (
            "OpenGNT lexical lookup references plus STEPBible TBESG "
            "brief definitions keyed by Extended Strong's number"
        ),
        "source": manifest["pinnedFile"],
        "sourceSha256": manifest["pinnedFileSha256"],
        "lexiconSource": tbesg_manifest.get(
            "dataset",
            "STEPBible TBESG",
        ),
        "lexiconLicense": tbesg_manifest.get("license", "CC BY 4.0"),
        "lexiconSourceSha256": tbesg_manifest["pinnedFileSha256"],
        "lexiconCoverage": round(coverage, 6),
        "entries": entries,
    }

    write_json(
        SOURCE_DATA / "lexical-index.json",
        payload,
    )
    write_json(
        PUBLIC_DATA / "lexical-index.json",
        payload,
    )

    print(
        "Built lexical index: "
        f"{len(entries):,} Extended Strong's entries; "
        f"{lexical_matches:,} with TBESG definitions "
        f"({coverage:.1%})"
    )



def build_chapter(
    *,
    rows: list[dict],
    frequency: Counter,
    manifest: dict,
    book_number: int,
    book_code: str,
    book_name: str,
    chapter_number: int,
) -> int:
    target_rows = [
        row
        for row in rows
        if row["book"] == book_number
        and row["chapter"] == chapter_number
    ]

    if not target_rows:
        raise RuntimeError(
            f"No rows found for {book_name} "
            f"{chapter_number} "
            f"(OpenGNT book {book_number})."
        )

    grouped: dict[
        int,
        list[dict],
    ] = defaultdict(list)

    for row in target_rows:
        grouped[row["verse"]].append(row)

    found_verses = sorted(grouped)

    if not found_verses:
        raise RuntimeError(
            f"{book_name} {chapter_number}: no verse data found."
        )

    # Do NOT require verse numbers to be consecutive. Critical Greek NT
    # editions legitimately omit several traditional verse numbers.
    if any(verse <= 0 for verse in found_verses):
        raise RuntimeError(
            f"{book_name} {chapter_number}: invalid verse numbers "
            f"{found_verses}"
        )

    greek_verses = []
    english_verses = []
    compiled_verses = []

    for verse_number in found_verses:
        greek_tokens = []
        english_tokens = []
        compiled_tokens = []

        for position, row in enumerate(
            grouped[verse_number],
            start=1,
        ):
            token_id = (
                f"{book_code}."
                f"{chapter_number}."
                f"{verse_number}."
                f"{position}"
            )

            assert_no_display_markup(
                row["punctuationBefore"],
                field="punctuationBefore",
                token_id=token_id,
            )
            assert_no_display_markup(
                row["punctuationAfter"],
                field="punctuationAfter",
                token_id=token_id,
            )

            greek_token = {
                "id": token_id,
                "greek": row["greek"],
                "lemma": row["lemma"],
                "transliteration": row["transliteration"],
                "strongs": row["strongs"],
                "morphologyCode": row["morphologyCode"],
                "punctuationBefore": (
                    row["punctuationBefore"]
                ),
                "punctuationAfter": (
                    row["punctuationAfter"]
                ),
            }

            english_token = {
                "id": token_id,
                "english": row["english"],
                "englishRaw": (
                    row["englishRaw"]
                ),
            }

            compiled_token = {
                **greek_token,
                "english": row["english"],
                "frequency": (
                    frequency[row["lemma"]]
                ),
            }

            greek_tokens.append(
                greek_token
            )
            english_tokens.append(
                english_token
            )
            compiled_tokens.append(
                compiled_token
            )

        greek_verses.append({
            "verse": verse_number,
            "tokens": greek_tokens,
        })
        english_verses.append({
            "verse": verse_number,
            "tokens": english_tokens,
        })
        compiled_verses.append({
            "verse": verse_number,
            "tokens": compiled_tokens,
        })

    greek_source = {
        "source": manifest["pinnedFile"],
        "sourceSha256": manifest[
            "pinnedFileSha256"
        ],
        "book": book_name,
        "bookCode": book_code,
        "chapter": chapter_number,
        "verses": greek_verses,
    }

    english_source = {
        "source": (
            "OpenGNT context-sensitive "
            "interlinear slot "
            "(Berean-derived IT/BIB)"
        ),
        "sourceFile": manifest[
            "pinnedFile"
        ],
        "sourceSha256": manifest[
            "pinnedFileSha256"
        ],
        "book": book_name,
        "bookCode": book_code,
        "chapter": chapter_number,
        "verses": english_verses,
    }

    compiled = {
        "book": book_name,
        "bookCode": book_code,
        "chapter": chapter_number,
        "sources": {
            "pinnedOpenGnt": (
                manifest["pinnedFile"]
            ),
            "sha256": manifest[
                "pinnedFileSha256"
            ],
            "english": (
                "OpenGNT contextual "
                "interlinear translation "
                "adapted from Berean"
            ),
            "frequency": (
                "computed from pinned "
                "full-NT lemma stream"
            ),
        },
        "verses": compiled_verses,
    }

    greek_path = (
        SOURCE_DATA
        / "greek"
        / book_code
        / f"{chapter_number}.json"
    )
    english_path = (
        SOURCE_DATA
        / "english"
        / book_code
        / f"{chapter_number}.json"
    )
    compiled_path = (
        PUBLIC_DATA
        / "books"
        / book_code
        / f"{chapter_number}.json"
    )

    write_json(
        greek_path,
        greek_source,
    )
    write_json(
        english_path,
        english_source,
    )
    write_json(
        compiled_path,
        compiled,
    )

    token_count = sum(
        len(verse["tokens"])
        for verse in compiled_verses
    )

    print(
        f"Built {book_name} "
        f"{chapter_number}: "
        f"{len(compiled_verses)} verses, "
        f"{token_count} aligned units"
    )
    print(
        "  -> "
        f"{compiled_path.relative_to(ROOT)}"
    )

    return token_count


def build_all(
    rows: list[dict],
    manifest: dict,
    tbesg_manifest: dict,
    tbesg_entries: dict[str, dict],
) -> None:
    print(
        f"Parsed full NT: "
        f"{len(rows):,} word tokens"
    )

    sanitized_markers = sum(
        1
        for row in rows
        if (
            row["punctuationBeforeRaw"]
            != row["punctuationBefore"]
            or row["punctuationAfterRaw"]
            != row["punctuationAfter"]
        )
    )

    print(
        "Sanitized punctuation metadata on "
        f"{sanitized_markers:,} word rows"
    )

    frequency = build_vocabulary(
        rows,
        manifest,
    )
    build_lexical_index(
        rows,
        manifest,
        tbesg_manifest,
        tbesg_entries,
    )

    if len(NT_BOOKS) != EXPECTED_BOOK_COUNT:
        raise RuntimeError(
            f"NT book map contains {len(NT_BOOKS)} books; "
            f"expected {EXPECTED_BOOK_COUNT}."
        )

    configured_chapters = sum(
        book["chapters"] for book in NT_BOOKS
    )
    if configured_chapters != EXPECTED_CHAPTER_COUNT:
        raise RuntimeError(
            f"NT book map contains {configured_chapters} chapters; "
            f"expected {EXPECTED_CHAPTER_COUNT}."
        )

    # Verify the pinned corpus has exactly the chapter structure expected
    # by the app's canonical navigation.
    rows_by_book: dict[int, list[dict]] = defaultdict(list)
    for row in rows:
        rows_by_book[row["book"]].append(row)

    expected_book_numbers = {
        book["bookNumber"] for book in NT_BOOKS
    }
    actual_book_numbers = set(rows_by_book)

    unexpected_books = sorted(
        actual_book_numbers - expected_book_numbers
    )
    missing_books = sorted(
        expected_book_numbers - actual_book_numbers
    )

    if unexpected_books or missing_books:
        raise RuntimeError(
            "Pinned corpus book structure does not match the configured "
            f"New Testament. Missing books: {missing_books}; "
            f"unexpected books: {unexpected_books}"
        )

    for book in NT_BOOKS:
        actual_chapters = sorted({
            row["chapter"]
            for row in rows_by_book[book["bookNumber"]]
        })
        expected_chapters = list(
            range(1, book["chapters"] + 1)
        )

        if actual_chapters != expected_chapters:
            raise RuntimeError(
                f"{book['bookName']}: expected chapters "
                f"{expected_chapters}, found {actual_chapters}"
            )

    chapter_count = 0
    target_token_count = 0

    for book in NT_BOOKS:
        print()
        print(
            f"Building {book['bookName']} "
            f"({book['chapters']} chapters)"
        )

        for chapter_number in range(
            1,
            book["chapters"] + 1,
        ):
            target_token_count += build_chapter(
                rows=rows,
                frequency=frequency,
                manifest=manifest,
                book_number=book["bookNumber"],
                book_code=book["bookCode"],
                book_name=book["bookName"],
                chapter_number=chapter_number,
            )
            chapter_count += 1

    if chapter_count != EXPECTED_CHAPTER_COUNT:
        raise RuntimeError(
            f"Built {chapter_count} chapters; "
            f"expected {EXPECTED_CHAPTER_COUNT}."
        )

    # Since every OpenGNT row belongs to exactly one canonical NT chapter,
    # building the entire NT should account for every parsed word token once.
    if target_token_count != len(rows):
        raise RuntimeError(
            "Full-NT token accounting failed: "
            f"parsed {len(rows):,} tokens but built "
            f"{target_token_count:,} aligned units."
        )

    build_manifest = {
        "corpus": "Greek New Testament",
        "books": EXPECTED_BOOK_COUNT,
        "chapters": chapter_count,
        "alignedUnits": target_token_count,
        "source": manifest["pinnedFile"],
        "sourceSha256": manifest["pinnedFileSha256"],
        "lexiconSource": tbesg_manifest.get("dataset", "STEPBible TBESG"),
        "lexiconSourceSha256": tbesg_manifest["pinnedFileSha256"],
        "lexiconLicense": tbesg_manifest.get("license", "CC BY 4.0"),
        "frequencyMetric": "New Testament lemma frequency",
        "bookCodes": [
            book["bookCode"] for book in NT_BOOKS
        ],
    }
    write_json(
        PUBLIC_DATA / "corpus_manifest.json",
        build_manifest,
    )

    print()
    print(
        "Full New Testament build complete: "
        f"{EXPECTED_BOOK_COUNT} books, "
        f"{chapter_count} chapters, "
        f"{target_token_count:,} aligned units"
    )
    print(
        "Corpus manifest: "
        "public/data/corpus_manifest.json"
    )


def main() -> None:
    manifest, source_path = (
        load_manifest_and_source()
    )
    tbesg_manifest, tbesg_path = load_tbesg_source()

    print(
        "Pinned local Scripture source: "
        f"{source_path.relative_to(ROOT)}"
    )
    print(
        "Pinned local lexicon source: "
        f"{tbesg_path.relative_to(ROOT)}"
    )
    print("Network access during build: none")

    rows = parse_rows(
        source_path
    )
    tbesg_entries = parse_tbesg(tbesg_path)

    build_all(
        rows,
        manifest,
        tbesg_manifest,
        tbesg_entries,
    )


if __name__ == "__main__":
    main()
