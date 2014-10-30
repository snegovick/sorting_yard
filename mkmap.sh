if [ -e map_file.js ]; then
    rm ./map_file.js
fi

echo -n "var map_data = " > ./map_file.js
cat ./media/maps/level_0.json >> map_file.js
echo ";" >> map_file.js
