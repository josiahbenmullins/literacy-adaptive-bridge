#!/usr/bin/env python3
"""
Legacy command retained for clarity.

The reader now builds from a pinned local OpenGNT source instead of downloading
upstream data during normal work.

Initial/local setup:
    npm run data:pin
    npm run data:build

Normal reader development:
    npm run dev

Future source updates should be a separate deliberate maintenance workflow.
"""

print(__doc__.strip())
