#!/bin/bash

USAGE="resize.sh <source dir> <target dir> <size (integer>0)>"

if [ ! -d $1 ]; then
    echo "$1 is not a directory"
    echo ${USAGE}
fi

if [ -e $2 ]; then
    if [ ! -d $2 ]; then
        echo "$2 already exists and is not a directory"
        echo ${USAGE}
    fi
else
    mkdir $2
fi

if [ $3 -le 0 ]; then
    echo ${USAGE}
fi

for f in "$(ls "$1")"; do
	  convert "$1/$f" -resize $3x$3 "$2/$f";
done
