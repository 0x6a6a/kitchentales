#!/bin/sh
set -e

missing_vars=''
for var in HOST USER PASS; do
	full="RCLONE_FTP_$var"
	if eval [ -z \"\$$full\" ]; then
		printf 'Please set the %s environment variable.\n' "$full" >&2
		missing_vars='y'
	fi
done
[ -n "$missing_vars" ] && exit 1

cd dist
rclone sync . :ftp:kitchentales
