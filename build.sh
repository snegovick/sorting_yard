#!/usr/bin/env bash

function make_dir {
    directory=$1
    end_frame=$2
    new_size=$3
    mkdir "sprites/1000_${directory}"
    root_dir=$(pwd)
    echo "rendering ./media_src/${directory}.blend => ${root_dir}/sprites/1000_${directory}"
    blender -b "./media_src/${directory}.blend" -o "${root_dir}/sprites/1000_${directory}/" -F PNG -s 0 -e "${end_frame}" -a
    for f in $(ls sprites/1000_${directory}); do
        mv "sprites/1000_${directory}/$f" "sprites/1000_${directory}/${directory}_$f"
    done
    bash ./util/resize.sh "./sprites/1000_${directory}" "./sprites/128_$directory" ${new_size}
}

cat util.js screen.js sprite.js map.js game_logic.js main.js > game.js
#tar cvvf ./sprites.tar ./sprites

if [ -d ./sprites ]; then
    echo "sprites directory exists, just do nothing"
else
    echo "rendering sprites from .blend files"
    mkdir sprites
    make_dir locomotive 7 128x128
    make_dir red_tank 7 128x128
    make_dir straight_rail 1 128x256
    make_dir clean_tile 0 128x256
    make_dir straight_angle_rail 3 128x256
fi
