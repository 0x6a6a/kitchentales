#!/bin/sh
set -e

outdir='dist'

mkdir -p "$outdir"
./scripts/build-hls.sh
convert assets/background.webp -colorspace Gray -resize 1920x1080 -quality 75 "$outdir/background.jpg"
cp -av assets/favicon.png "$outdir/favicon.ico"
cp -av src/index.html src/kitchentales.css src/kitchentales.js "$outdir"
