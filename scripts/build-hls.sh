#!/bin/sh
set -e

inbase='assets/videos'
outbase='dist/hls'

for infile in $inbase/*.mov; do
	outdir="$outbase/$(basename "$infile" | sed -e 's/\.[^.]*$//')"
	if [ -d "$outdir" ]; then
		echo "$outdir exists, skipping $infile" >&2
		continue
	fi
	echo "$infile"
	mkdir -p "$outdir"
	ffmpeg -i "$infile" \
		-g 48 -sc_threshold 0 \
		-map 0:0 -map 0:1 -map 0:0 -map 0:1 \
		-s:v:0 1920x1080 -c:v:0 h264 -b:v:0 3000k \
		-s:v:1   640x360 -c:v:1 h264 -b:v:1  200k \
		-c:a aac -b:a 128k \
		-var_stream_map 'v:0,a:0, v:1,a:1' \
		-master_pl_name "main.m3u8" \
		-f hls -hls_time 4 -hls_list_size 0 \
		-hls_segment_filename "$outdir/v%v/chunk%04d.ts" \
		"$outdir/v%v/variant.m3u8"
done
