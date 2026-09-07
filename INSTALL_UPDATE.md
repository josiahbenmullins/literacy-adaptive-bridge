# Apply GNT Reader v0.2 Update

This update is intended to be copied into your EXISTING `gnt_reader_nextjs_v1`
project, because that project already contains:

    source_data/raw/OpenGNT_BASE_TEXT.zip

## Apply

1. Stop `npm run dev` if it is running (Ctrl+C in the terminal).
2. Copy the contents of this update folder into the ROOT of your existing
   `gnt_reader_nextjs_v1` folder.
3. When macOS asks, choose to replace/overwrite the files.

Do NOT delete:

    source_data/raw/OpenGNT_BASE_TEXT.zip

## Then run

    npm run data:setup

That performs two one-time/build-time operations:

1. Pins the exact already-downloaded OpenGNT CSV and records its SHA-256 checksum.
2. Parses the pinned full NT, computes lemma frequencies, and builds
   1 John 1:1-10 for the app.

Expected ending:

    Built 1 John 1: 10 verses, ... aligned units
    Output: public/data/books/1JN/1.json

## Then run the reader

    npm run dev

Open:

    http://localhost:3000

From then on, normal use is simply:

    npm run dev

No internet source lookup or lemma-frequency calculation is needed during
normal app use.
