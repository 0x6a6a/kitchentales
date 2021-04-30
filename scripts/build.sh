#!/bin/sh
set -e

outdir='dist'

mkdir -p "$outdir"
./scripts/build-hls.sh
cp -av src/index.html "$outdir"
