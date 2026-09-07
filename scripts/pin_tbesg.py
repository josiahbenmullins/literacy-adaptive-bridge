#!/usr/bin/env python3
"""
Download and pin the open STEPBible TBESG Greek lexicon locally.

This is a developer/build-time operation only. The app runtime does not fetch
lexical data from the internet.

Source:
  STEPBible/STEPBible-Data
  TBESG - Translators Brief lexicon of Extended Strongs for Greek
License:
  Creative Commons Attribution 4.0 International (CC BY 4.0)
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil
import urllib.request


ROOT = Path(__file__).resolve().parents[1]
TARGET_DIR = ROOT / "source_data" / "vendor" / "stepbible" / "tbesg"
TARGET_FILE = TARGET_DIR / "TBESG.txt"
MANIFEST_FILE = TARGET_DIR / "SOURCE_MANIFEST.json"

SOURCE_URL = (
    "https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/"
    "Lexicons/TBESG%20-%20Translators%20Brief%20lexicon%20of%20Extended%20"
    "Strongs%20for%20Greek%20-%20STEPBible.org%20CC%20BY.txt"
)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def download(target: Path) -> None:
    request = urllib.request.Request(
        SOURCE_URL,
        headers={"User-Agent": "GNT-Reader-data-pinner/1.0"},
    )
    with urllib.request.urlopen(request, timeout=90) as response:
        with target.open("wb") as handle:
            shutil.copyfileobj(response, handle)


def looks_like_tbesg(path: Path) -> bool:
    checked = 0
    with path.open("r", encoding="utf-8-sig", errors="replace") as handle:
        for line in handle:
            cols = line.rstrip("\n").split("\t")
            if len(cols) >= 8 and re.match(r"^G\d+", cols[0].strip()):
                checked += 1
                if checked >= 3:
                    return True
    return False


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--file",
        type=Path,
        help=(
            "Use an already-downloaded TBESG file instead of downloading it. "
            "Useful for fully manual/offline source acquisition."
        ),
    )
    args = parser.parse_args()

    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    temp_path = TARGET_DIR / "TBESG.txt.tmp"

    try:
        if args.file:
            source = args.file.expanduser().resolve()
            if not source.exists():
                raise SystemExit(f"TBESG file does not exist: {source}")
            shutil.copyfile(source, temp_path)
            acquired_from = str(source)
        else:
            print("Downloading STEPBible TBESG (CC BY 4.0)...")
            download(temp_path)
            acquired_from = SOURCE_URL

        if not looks_like_tbesg(temp_path):
            raise RuntimeError(
                "Downloaded/copied file does not look like the expected TBESG TSV lexicon."
            )

        temp_path.replace(TARGET_FILE)
        sha = sha256_file(TARGET_FILE)

        manifest = {
            "dataset": "STEPBible TBESG - Translators Brief lexicon of Extended Strongs for Greek",
            "license": "CC BY 4.0",
            "attribution": (
                "Lexicon data from STEPBible.org / STEPBible-Data, based on work "
                "at Tyndale House Cambridge; licensed CC BY 4.0."
            ),
            "canonicalRepository": "https://github.com/STEPBible/STEPBible-Data",
            "sourceUrl": SOURCE_URL,
            "acquiredFrom": acquired_from,
            "pinnedFile": TARGET_FILE.name,
            "pinnedFileSha256": sha,
        }

        MANIFEST_FILE.write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

        print(f"Pinned: {TARGET_FILE.relative_to(ROOT)}")
        print(f"SHA-256: {sha}")
        print(f"Manifest: {MANIFEST_FILE.relative_to(ROOT)}")
    finally:
        if temp_path.exists():
            temp_path.unlink()


if __name__ == "__main__":
    main()
