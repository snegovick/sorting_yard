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


for f in $(ls "$1"); do
    echo "converting $1/$f"
	  convert "$1/$f" -scale $3 "$2/$f";
done
