#!/usr/bin/env python3
"""
Pin the already-downloaded OpenGNT source into a stable local vendor directory.

Normal application use never calls this script. Run it only when:
- setting up the canonical source for the first time, or
- deliberately evaluating a future upstream source update.

Expected initial download:
    source_data/raw/OpenGNT_BASE_TEXT.zip

Output:
    source_data/vendor/opengnt/<actual OpenGNT v3 csv>
    source_data/vendor/opengnt/SOURCE_MANIFEST.json
"""

from __future__ import annotations

from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[1]
RAW_ZIP = ROOT / "source_data" / "raw" / "OpenGNT_BASE_TEXT.zip"
VENDOR_DIR = ROOT / "source_data" / "vendor" / "opengnt"
MANIFEST = VENDOR_DIR / "SOURCE_MANIFEST.json"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def choose_source_member(archive: zipfile.ZipFile) -> str:
    candidates = []
    for name in archive.namelist():
        basename = Path(name).name
        if not basename:
            continue
        if name.startswith("__MACOSX/") or basename.startswith("._"):
            continue
        lowered = basename.lower()
        if (
            lowered.startswith("opengnt_version3")
            and lowered.endswith(".csv")
        ):
            candidates.append(name)

    if len(candidates) != 1:
        raise RuntimeError(
            "Expected exactly one non-metadata OpenGNT v3 CSV in "
            f"{RAW_ZIP.name}; found: {candidates}"
        )
    return candidates[0]


def main() -> None:
    if not RAW_ZIP.exists():
        raise SystemExit(
            "The OpenGNT source ZIP is not present.\n"
            f"Expected: {RAW_ZIP.relative_to(ROOT)}\n\n"
            "Your earlier importer normally downloaded this file already."
        )

    VENDOR_DIR.mkdir(parents=True, exist_ok=True)

    zip_sha = sha256_file(RAW_ZIP)

    with zipfile.ZipFile(RAW_ZIP) as archive:
        member = choose_source_member(archive)
        basename = Path(member).name
        target = VENDOR_DIR / basename

        with archive.open(member) as source, target.open("wb") as dest:
            shutil.copyfileobj(source, dest)

    csv_sha = sha256_file(target)

    manifest = {
        "source": "OpenGNT",
        "sourceRepository": "https://github.com/eliranwong/OpenGNT",
        "sourceArchive": RAW_ZIP.name,
        "sourceArchiveSha256": zip_sha,
        "pinnedFile": target.name,
        "pinnedFileSha256": csv_sha,
        "pinnedAtUtc": datetime.now(timezone.utc).isoformat(),
        "role": (
            "Canonical v1 source for Greek surface text, lemma, contextual "
            "Berean-derived interlinear translation, and punctuation."
        ),
        "normalRuntimeNeedsInternet": False,
        "normalRuntimeRecalculatesFrequency": False,
    }

    MANIFEST.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Pinned source: {target.relative_to(ROOT)}")
    print(f"CSV SHA-256: {csv_sha}")
    print(f"Manifest: {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
