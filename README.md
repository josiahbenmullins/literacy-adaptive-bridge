# GNT Hybrid Reader v0.2 — Pinned Local Scripture Data

The reader UI is Next.js/React. The Scripture build pipeline is Python.

## Core rule

At build time, Python reads one pinned local OpenGNT source and produces
chapter JSON files. At runtime the app performs no linguistic analysis,
downloads no Scripture data, and recalculates no frequencies.

Each compiled aligned unit contains:

- Greek surface form
- contextual Berean-derived English word/phrase for that exact occurrence
- lemma
- total NT lemma frequency
- punctuation

The reader then uses:

    frequency > threshold -> Greek
    frequency <= threshold -> contextual English

A tap flips only that occurrence.

## One-time setup from your existing project

Your earlier importer already downloaded:

    source_data/raw/OpenGNT_BASE_TEXT.zip

Pin that exact file as the canonical v1 source:

    npm run data:pin

Then generate the full 1 John 1 dataset:

    npm run data:build

Or do both:

    npm run data:setup

The pin step:
- ignores macOS `__MACOSX` metadata files,
- extracts the actual versioned OpenGNT v3 CSV,
- records SHA-256 checksums,
- writes `source_data/vendor/opengnt/SOURCE_MANIFEST.json`.

The build step:
- verifies the checksum,
- parses by semantic header names rather than brittle fixed columns,
- counts lemma frequency over the entire pinned NT,
- extracts 1 John 1:1–10,
- writes `public/data/books/1JN/1.json`.

## Normal use after that

    npm run dev

Open:

    http://localhost:3000

Normal app use requires:
- no internet source lookup,
- no lemma-frequency recalculation,
- no Python process,
- no source update.

The deployed app reads only the compiled local JSON.

## Intentional future source update

Source updating is deliberately separate from ordinary development.
A future `update_sources.py` can download a candidate version, compare
checksums/schema/text, and only replace the pinned source after review.
