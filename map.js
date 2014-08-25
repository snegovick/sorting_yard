function Map() {};

Map.prototype = {
  map: {"layers": [{"adjacency_dct": {}, "type": "layer", "name": "main", "objects": [{"sprite_ref": "rail", "name": "4", "position": [448, 0], "frame": 4, "animated": false, "type": "proxy", "id": 4, "frame_time": 10}, {"sprite_ref": "rail", "name": "7", "position": [384, 32], "frame": 4, "animated": false, "type": "proxy", "id": 7, "frame_time": 10}, {"sprite_ref": "rail", "name": "5", "position": [512, 32], "frame": 4, "animated": false, "type": "proxy", "id": 5, "frame_time": 10}, {"sprite_ref": "rail", "name": "6", "position": [448, 64], "frame": 4, "animated": false, "type": "proxy", "id": 6, "frame_time": 10}, {"sprite_ref": "rail", "name": "9", "position": [576, 64], "frame": 4, "animated": false, "type": "proxy", "id": 9, "frame_time": 10}, {"sprite_ref": "rail", "name": "8", "position": [512, 96], "frame": 4, "animated": false, "type": "proxy", "id": 8, "frame_time": 10}]}], "grid_step": [32, 32], "map_size": [256, 256], "format": 1, "images": {"red_tank_0001.png": {"origin": [896, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0001.png"}, "straight_angle_rail_0003.png": {"origin": [0, 512], "type": "image", "dimensions": [128, 256], "name": "straight_angle_rail_0003.png"}, "straight_angle_rail_0001.png": {"origin": [256, 512], "type": "image", "dimensions": [128, 256], "name": "straight_angle_rail_0001.png"}, "red_tank_0005.png": {"origin": [384, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0005.png"}, "red_tank_0004.png": {"origin": [0, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0004.png"}, "red_tank_0006.png": {"origin": [768, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0006.png"}, "locomotive_0007.png": {"origin": [0, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0007.png"}, "locomotive_0004.png": {"origin": [384, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0004.png"}, "locomotive_0005.png": {"origin": [256, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0005.png"}, "clean_tile_0000.png": {"origin": [512, 512], "type": "image", "dimensions": [128, 256], "name": "clean_tile_0000.png"}, "straight_rail_0001.png": {"origin": [640, 512], "type": "image", "dimensions": [128, 256], "name": "straight_rail_0001.png"}, "straight_rail_0000.png": {"origin": [768, 512], "type": "image", "dimensions": [128, 256], "name": "straight_rail_0000.png"}, "red_tank_0003.png": {"origin": [640, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0003.png"}, "red_tank_0007.png": {"origin": [128, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0007.png"}, "locomotive_0006.png": {"origin": [128, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0006.png"}, "straight_angle_rail_0002.png": {"origin": [128, 512], "type": "image", "dimensions": [128, 256], "name": "straight_angle_rail_0002.png"}, "locomotive_0002.png": {"origin": [640, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0002.png"}, "straight_angle_rail_0000.png": {"origin": [384, 512], "type": "image", "dimensions": [128, 256], "name": "straight_angle_rail_0000.png"}, "red_tank_0000.png": {"origin": [512, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0000.png"}, "red_tank_0002.png": {"origin": [256, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0002.png"}, "locomotive_0003.png": {"origin": [512, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0003.png"}, "locomotive_0000.png": {"origin": [896, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0000.png"}, "locomotive_0001.png": {"origin": [768, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0001.png"}}, "tileset_path": "/home/snegovick/dev_games/sorting_yard/media/tilesets/level_0.json", "type": "map", "sprites": {"steam_locomotive": {"type": "sprite", "name": "steam_locomotive", "image_refs": ["locomotive_0007.png", "locomotive_0006.png", "locomotive_0005.png", "locomotive_0004.png", "locomotive_0003.png", "locomotive_0002.png", "locomotive_0001.png", "locomotive_0000.png"]}, "rail": {"type": "sprite", "name": "rail", "image_refs": ["straight_angle_rail_0003.png", "straight_angle_rail_0002.png", "straight_angle_rail_0001.png", "straight_angle_rail_0000.png", "clean_tile_0000.png", "straight_rail_0001.png", "straight_rail_0000.png"]}, "red_tank_car": {"type": "sprite", "name": "red_tank_car", "image_refs": ["red_tank_0004.png", "red_tank_0007.png", "red_tank_0002.png", "red_tank_0005.png", "red_tank_0000.png", "red_tank_0003.png", "red_tank_0006.png", "red_tank_0001.png"]}}},
  
  atlas: null,
  sprites: [],
  layers: [],

  load_tileset: function(self) {
    atlas = new Image();
    atlas.src = tileset_json["image"];
    sprites
  },

  init: function(self) {
    var rt_sprite = new Sprite();
    rt_sprite.initMultiPath(rt_sprite, self.map["sprites"]["red_tank"]);
    self.sprites["red_tank"] = rt_sprite;
  },

  draw: function(self) {
  }
};

var map = new Map();
