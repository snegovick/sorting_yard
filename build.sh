#!/usr/bin/env bash

cat util.js screen.js sprite.js map.js game_logic.js main.js > game.js
#tar cvvf ./sprites.tar ./sprites

if [ -d ./sprites ]; then
    echo "sprites directory exists, just do nothing"
else
    echo "rendering sprites from .blend files"
    mkdir sprites
    mkdir sprites/1000_locomotive
    mkdir sprites/1000_red_tank
    mkdir sprites/1000_straight_rail

    pushd media_src
    
    blender -b ./locomotive.blend -o ../sprites/1000_locomotive -F PNG -s 0 -e 7 -a
    blender -b ./red_tank.blend -o ../sprites/1000_red_tank -F PNG -s 0 -e 7 -a
    blender -b ./straight_rail.blend -o ../sprites/1000_straight_rail -F PNG -s 0 -e 7 -a

    popd

    bash ./util/resize.sh ./sprites/1000_locomotive ./sprites/128_locomotive 128
    bash ./util/resize.sh ./sprites/1000_red_tank ./sprites/128_red_tank 128
    bash ./util/resize.sh ./sprites/1000_straight_rail ./sprites/128_straight_rail 128
fi
