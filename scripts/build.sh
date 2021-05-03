#!/bin/sh
set -e

outdir='dist'

mkdir -p "$outdir"
./scripts/build-hls.sh
convert assets/background.webp -colorspace Gray -resize 3840x2160 -quality 75 "$outdir/background.jpg"
cp -av src/index.html src/kitchentales.css src/kitchentales.js "$outdir"
