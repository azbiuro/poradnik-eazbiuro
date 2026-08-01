#!/bin/bash
set -e
cd "$(dirname "$0")"
python3 tools/przebuduj_poradnik.py --root .
echo "GOTOWE. Nagłówek, menu i stopka zostały ujednolicone."
