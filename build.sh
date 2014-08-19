#!/usr/bin/env bash

function make_dir {
    directory=$1
    end_frame=$2
    new_size=$3
    mkdir "media/sprites/1000_${directory}"
    root_dir=$(pwd)
    echo "rendering ./media/models/${directory}.blend => ${root_dir}/media/sprites/1000_${directory}"
    blender -noaudio -b "./media/models/${directory}.blend" -o "${root_dir}/media/sprites/1000_${directory}/" -F PNG -s 0 -e "${end_frame}" -a
    for f in $(ls media/sprites/1000_${directory}); do
        mv "media/sprites/1000_${directory}/$f" "media/sprites/1000_${directory}/${directory}_$f"
    done
    bash ./util/resize.sh "./media/sprites/1000_${directory}" "./media/sprites/128_$directory" ${new_size}
}

cat util.js screen.js sprite.js map.js game_logic.js main.js > game.js
#tar cvvf ./sprites.tar ./sprites

echo "rendering sprites from .blend files"
if [ ! -d media/sprites ]; then
	mkdir media/sprites
fi
make_dir locomotive 7 128x128
make_dir red_tank 7 128x128
make_dir straight_rail 1 128x256
make_dir clean_tile 0 128x256
make_dir straight_angle_rail 3 128x256

python ./map_editor/tileset_editor/tileset_editor.py --reexport --project ./media/tilesets/level_0.tset_project --out ./media/tilesets/level_0
