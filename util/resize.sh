#!/bin/bash

for f in "$@"; do
	convert "$f" -resize 128x128 "128_$f";
done
