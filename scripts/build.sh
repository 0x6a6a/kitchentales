#!/bin/sh
set -e

outdir='dist'

mkdir -p "$outdir"
./scripts/build-hls.sh
cp -av assets/background.jpg src/index.html src/kitchentales.css src/kitchentales.js "$outdir"
