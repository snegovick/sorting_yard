var pt_to_pt_dist = function(p1, p2) {
  var x = (p1[0]-p2[0]);
  var y = (p1[1]-p2[1]);
  return Math.sqrt(x*x+y*y);
};

function get_random_int(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function GameScreen() {};

GameScreen.prototype = {
  canvas: null,
  width: 0,
  height: 0,
  ctx: null,
  const_fps: 30,
  frame_timeout: 0,


  init: function(self) {
    self.frame_timeout = 1000/self.const_fps;
    self.canvas = document.getElementById("canvas");
    var min_dim = Math.min(window.innerWidth, window.innerHeight);
    console.log("min_dim:", min_dim);
    self.canvas.width = min_dim;
    self.canvas.height = min_dim;
    self.width = self.canvas.width;
    self.height = self.canvas.height;
    self.ctx = self.canvas.getContext("2d");
  },

  set_keydown_cb: function(self, cb) {
    window.addEventListener('keydown', cb, true);
  },

  get_text_w: function(self, cw, text) {
    return cw*text.length;
  },

  put_text: function(self, font, style, text, px, py) {
    var old_color = self.ctx.fillStyle;
    self.ctx.fillStyle = style;
    var old_font = self.ctx.font;
    self.ctx.font = font;
    self.ctx.fillText(text, px, py);
    self.ctx.fillStyle = old_color;
    self.ctx.font = old_font;
  },

  put_line: function(self, style, sx, sy, ex, ey, width) {
    width = width || 5;
    var old_color = self.ctx.fillStyle;
    var old_width = self.ctx.lineWidth;
    self.ctx.strokeStyle = style;
    self.ctx.lineWidth = width;
    self.ctx.beginPath();
    self.ctx.moveTo(sx, sy);
    self.ctx.lineTo(ex, ey);
    self.ctx.stroke();
    self.ctx.strokeStyle = old_color;
    self.ctx.lineWidth = old_width;
  },

  put_rect: function(self, style, orientation, x, y, w, h) {
    self.ctx.translate(x, y);
    if (orientation != 0) {
      self.ctx.rotate(orientation);
    }
    var old_color = self.ctx.fillStyle;
    self.ctx.fillStyle = style;
    self.ctx.fillRect(-w/2, -h/2, w, h);
    self.ctx.fillStyle = old_color;
    if (orientation != 0) {
      self.ctx.rotate(-orientation);
    }
    self.ctx.translate(-x, -y);
  },

  draw: function(self, callback) {
    self.ctx.clearRect(0, 0, self.width, self.height);
    callback();
  }
};

var gamescreen = new GameScreen();
function LImage() {};

LImage.prototype = {
  origin: null,
  dimensions: null,
  name: name,

  init: function(self, image_json) {
    self.name = image_json["name"];
    self.origin = image_json["origin"];
    self.dimensions = image_json["dimensions"];
    // console.log("loading image "+self.name);
  },

  get_dimensions: function(self) {
    return self.dimensions;
  },

  draw: function(self, x, y) {
    // console.log("x, y: "+x+", "+y);
    // console.log("origin: "+self.origin);
    // console.log("dimensions: "+self.dimensions);
    gamescreen.ctx.drawImage(map.atlas, 
                             self.origin[0], self.origin[1], 
                             self.dimensions[0], self.dimensions[1], 
                             x, y,
                             self.dimensions[0], self.dimensions[1]);
  }

};

function Sprite() {};

Sprite.prototype = {
  images: [],
  frames: 0,
  name: "",

  init: function(self, sprite_json) {
    self.name = sprite_json["name"];
    image_refs = sprite_json["image_refs"];
    self.frames = image_refs.length;

    self.images = [];
    for (var i = 0; i < self.frames; i++) {
      var image = map.get_image_by_name(map, image_refs[i]);
      if (image === null) {
        console.log("null image: "+image_refs[i]);
      }
      self.images.push(image);
    }
  },

  get_dimensions: function(self, frame) {
    return self.images[frame].get_dimensions(self.images[frame]);
  },

  get_n_frames: function(self) {
    return self.frames;
  },

  drawFrame: function(self, frame, x, y) {
    var image = self.images[frame];
    image.draw(image, x, y);
  },

  draw: function(self, x, y) {
    self.drawFrame(self, self.current_frame, x, y);
  }

};

function Map() {};

Map.prototype = {
  map: {"layers": {"main": {"adjacency_dct": {}, "type": "layer", "name": "main", "objects": [{"sprite_ref": "rail", "name": "39", "position": [480, 32], "frame": 0, "animated": false, "type": "proxy", "id": 39, "frame_time": 10}, {"sprite_ref": "rail", "name": "38", "position": [416, 64], "frame": 6, "animated": false, "type": "proxy", "id": 38, "frame_time": 10}, {"sprite_ref": "rail", "name": "40", "position": [544, 64], "frame": 5, "animated": false, "type": "proxy", "id": 40, "frame_time": 10}, {"sprite_ref": "rail", "name": "37", "position": [352, 96], "frame": 2, "animated": false, "type": "proxy", "id": 37, "frame_time": 10}, {"sprite_ref": "rail", "name": "42", "position": [608, 96], "frame": 3, "animated": false, "type": "proxy", "id": 42, "frame_time": 10}, {"sprite_ref": "rail", "name": "36", "position": [416, 128], "frame": 5, "animated": false, "type": "proxy", "id": 36, "frame_time": 10}, {"sprite_ref": "rail", "name": "41", "position": [544, 128], "frame": 2, "animated": false, "type": "proxy", "id": 41, "frame_time": 10}, {"sprite_ref": "rail", "name": "35", "position": [480, 160], "frame": 3, "animated": false, "type": "proxy", "id": 35, "frame_time": 10}, {"sprite_ref": "rail", "name": "18", "position": [608, 160], "frame": 3, "animated": false, "type": "proxy", "id": 18, "frame_time": 10}, {"sprite_ref": "rail", "name": "8", "position": [864, 160], "frame": 4, "animated": false, "type": "proxy", "id": 8, "frame_time": 10}, {"sprite_ref": "rail", "name": "32", "position": [416, 192], "frame": 2, "animated": false, "type": "proxy", "id": 32, "frame_time": 10}, {"sprite_ref": "rail", "name": "17", "position": [544, 192], "frame": 2, "animated": false, "type": "proxy", "id": 17, "frame_time": 10}, {"sprite_ref": "rail", "name": "5", "position": [800, 192], "frame": 4, "animated": false, "type": "proxy", "id": 5, "frame_time": 10}, {"sprite_ref": "rail", "name": "6", "position": [928, 192], "frame": 4, "animated": false, "type": "proxy", "id": 6, "frame_time": 10}, {"sprite_ref": "rail", "name": "31", "position": [480, 224], "frame": 3, "animated": false, "type": "proxy", "id": 31, "frame_time": 10}, {"sprite_ref": "rail", "name": "16", "position": [608, 224], "frame": 5, "animated": false, "type": "proxy", "id": 16, "frame_time": 10}, {"sprite_ref": "rail", "name": "10", "position": [736, 224], "frame": 0, "animated": false, "type": "proxy", "id": 10, "frame_time": 10}, {"sprite_ref": "rail", "name": "4", "position": [864, 224], "frame": 4, "animated": false, "type": "proxy", "id": 4, "frame_time": 10}, {"sprite_ref": "rail", "name": "9", "position": [992, 224], "frame": 4, "animated": false, "type": "proxy", "id": 9, "frame_time": 10}, {"sprite_ref": "rail", "name": "30", "position": [416, 256], "frame": 2, "animated": false, "type": "proxy", "id": 30, "frame_time": 10}, {"sprite_ref": "rail", "name": "15", "position": [672, 256], "frame": 1, "animated": false, "type": "proxy", "id": 15, "frame_time": 10}, {"sprite_ref": "rail", "name": "11", "position": [800, 256], "frame": 5, "animated": false, "type": "proxy", "id": 11, "frame_time": 10}, {"sprite_ref": "rail", "name": "7", "position": [928, 256], "frame": 4, "animated": false, "type": "proxy", "id": 7, "frame_time": 10}, {"sprite_ref": "rail", "name": "29", "position": [480, 288], "frame": 3, "animated": false, "type": "proxy", "id": 29, "frame_time": 10}, {"sprite_ref": "rail", "name": "12", "position": [864, 288], "frame": 5, "animated": false, "type": "proxy", "id": 12, "frame_time": 10}, {"sprite_ref": "rail", "name": "28", "position": [416, 320], "frame": 2, "animated": false, "type": "proxy", "id": 28, "frame_time": 10}, {"sprite_ref": "rail", "name": "13", "position": [928, 320], "frame": 5, "animated": false, "type": "proxy", "id": 13, "frame_time": 10}, {"sprite_ref": "rail", "name": "27", "position": [480, 352], "frame": 5, "animated": false, "type": "proxy", "id": 27, "frame_time": 10}, {"sprite_ref": "rail", "name": "14", "position": [992, 352], "frame": 3, "animated": false, "type": "proxy", "id": 14, "frame_time": 10}, {"sprite_ref": "rail", "name": "26", "position": [544, 384], "frame": 5, "animated": false, "type": "proxy", "id": 26, "frame_time": 10}, {"sprite_ref": "rail", "name": "23", "position": [672, 384], "frame": 0, "animated": false, "type": "proxy", "id": 23, "frame_time": 10}, {"sprite_ref": "rail", "name": "21", "position": [800, 384], "frame": 0, "animated": false, "type": "proxy", "id": 21, "frame_time": 10}, {"sprite_ref": "rail", "name": "19", "position": [928, 384], "frame": 6, "animated": false, "type": "proxy", "id": 19, "frame_time": 10}, {"sprite_ref": "rail", "name": "25", "position": [608, 416], "frame": 1, "animated": false, "type": "proxy", "id": 25, "frame_time": 10}, {"sprite_ref": "rail", "name": "22", "position": [736, 416], "frame": 1, "animated": false, "type": "proxy", "id": 22, "frame_time": 10}, {"sprite_ref": "rail", "name": "20", "position": [864, 416], "frame": 1, "animated": false, "type": "proxy", "id": 20, "frame_time": 10}]}, "waypoints": {"adjacency_dct": {"0": [1], "1": [2], "2": [3], "3": [4], "4": [5], "5": [6], "6": [13], "7": [8], "8": [9], "9": [10], "10": [11], "11": [12], "12": [0], "13": [7]}, "type": "layer", "name": "waypoints", "objects": [{"sprite_ref": "12", "name": "12", "position": [512, 224], "frame": 0, "animated": false, "type": "proxy", "id": 12, "frame_time": 10}, {"sprite_ref": "0", "name": "0", "position": [576, 224], "frame": 0, "animated": false, "type": "proxy", "id": 0, "frame_time": 10}, {"sprite_ref": "11", "name": "11", "position": [448, 256], "frame": 0, "animated": false, "type": "proxy", "id": 11, "frame_time": 10}, {"sprite_ref": "1", "name": "1", "position": [640, 256], "frame": 0, "animated": false, "type": "proxy", "id": 1, "frame_time": 10}, {"sprite_ref": "10", "name": "10", "position": [448, 288], "frame": 0, "animated": false, "type": "proxy", "id": 10, "frame_time": 10}, {"sprite_ref": "9", "name": "9", "position": [512, 320], "frame": 0, "animated": false, "type": "proxy", "id": 9, "frame_time": 10}, {"sprite_ref": "2", "name": "2", "position": [640, 384], "frame": 0, "animated": false, "type": "proxy", "id": 2, "frame_time": 10}, {"sprite_ref": "3", "name": "3", "position": [704, 416], "frame": 0, "animated": false, "type": "proxy", "id": 3, "frame_time": 10}, {"sprite_ref": "4", "name": "4", "position": [832, 416], "frame": 0, "animated": false, "type": "proxy", "id": 4, "frame_time": 10}, {"sprite_ref": "8", "name": "8", "position": [512, 512], "frame": 0, "animated": false, "type": "proxy", "id": 8, "frame_time": 10}, {"sprite_ref": "5", "name": "5", "position": [1024, 512], "frame": 0, "animated": false, "type": "proxy", "id": 5, "frame_time": 10}, {"sprite_ref": "6", "name": "6", "position": [1024, 544], "frame": 0, "animated": false, "type": "proxy", "id": 6, "frame_time": 10}, {"sprite_ref": "7", "name": "7", "position": [640, 576], "frame": 0, "animated": false, "type": "proxy", "id": 7, "frame_time": 10}, {"sprite_ref": "13", "name": "13", "position": [960, 576], "frame": 0, "animated": false, "type": "proxy", "id": 13, "frame_time": 10}]}}, "grid_step": [32, 32], "map_size": [256, 256], "format": 1, "images": {"red_tank_0001.png": {"origin": [896, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0001.png"}, "straight_angle_rail_0003.png": {"origin": [0, 512], "type": "image", "dimensions": [128, 256], "name": "straight_angle_rail_0003.png"}, "straight_angle_rail_0001.png": {"origin": [256, 512], "type": "image", "dimensions": [128, 256], "name": "straight_angle_rail_0001.png"}, "red_tank_0005.png": {"origin": [384, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0005.png"}, "red_tank_0004.png": {"origin": [0, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0004.png"}, "red_tank_0006.png": {"origin": [768, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0006.png"}, "locomotive_0007.png": {"origin": [0, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0007.png"}, "locomotive_0004.png": {"origin": [384, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0004.png"}, "locomotive_0005.png": {"origin": [256, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0005.png"}, "clean_tile_0000.png": {"origin": [512, 512], "type": "image", "dimensions": [128, 256], "name": "clean_tile_0000.png"}, "straight_rail_0001.png": {"origin": [640, 512], "type": "image", "dimensions": [128, 256], "name": "straight_rail_0001.png"}, "straight_rail_0000.png": {"origin": [768, 512], "type": "image", "dimensions": [128, 256], "name": "straight_rail_0000.png"}, "red_tank_0003.png": {"origin": [640, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0003.png"}, "red_tank_0007.png": {"origin": [128, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0007.png"}, "locomotive_0006.png": {"origin": [128, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0006.png"}, "straight_angle_rail_0002.png": {"origin": [128, 512], "type": "image", "dimensions": [128, 256], "name": "straight_angle_rail_0002.png"}, "locomotive_0002.png": {"origin": [640, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0002.png"}, "straight_angle_rail_0000.png": {"origin": [384, 512], "type": "image", "dimensions": [128, 256], "name": "straight_angle_rail_0000.png"}, "red_tank_0000.png": {"origin": [512, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0000.png"}, "red_tank_0002.png": {"origin": [256, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0002.png"}, "locomotive_0003.png": {"origin": [512, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0003.png"}, "locomotive_0000.png": {"origin": [896, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0000.png"}, "locomotive_0001.png": {"origin": [768, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0001.png"}}, "type": "map", "sprites": {"steam_locomotive": {"type": "sprite", "name": "steam_locomotive", "image_refs": ["locomotive_0007.png", "locomotive_0006.png", "locomotive_0005.png", "locomotive_0004.png", "locomotive_0003.png", "locomotive_0002.png", "locomotive_0001.png", "locomotive_0000.png"]}, "rail": {"type": "sprite", "name": "rail", "image_refs": ["straight_angle_rail_0003.png", "straight_angle_rail_0002.png", "straight_angle_rail_0001.png", "straight_angle_rail_0000.png", "clean_tile_0000.png", "straight_rail_0001.png", "straight_rail_0000.png"]}, "red_tank_car": {"type": "sprite", "name": "red_tank_car", "image_refs": ["red_tank_0004.png", "red_tank_0007.png", "red_tank_0002.png", "red_tank_0005.png", "red_tank_0000.png", "red_tank_0003.png", "red_tank_0006.png", "red_tank_0001.png"]}}, "atlas_path": "media/tilesets/level_0.png"},
  
  atlas: null,
  images: {},
  sprites: {},
  layers: {},

  get_image_by_name: function(self, name) {
    if (name in self.images) {
      return self.images[name];
    }
    return null;
  },

  get_sprite_by_name: function(self, name) {
    if (name in self.sprites) {
      return self.sprites[name];
    }
    return null;
  },

  init: function(self) {
    self.atlas = new Image();
    self.atlas.onLoad=function() {
      console.log("atlas loaded");
    };
    self.atlas.src = self.map["atlas_path"];

    for (var i in self.map["images"]) {
      var image_json = self.map["images"][i];
      var image = new LImage();
      image.init(image, image_json);
      self.images[image.name] = image;
    }

    for (var s in self.map["sprites"]) {
      var sprite_json = self.map["sprites"][s];
      var sprite = new Sprite();
      sprite.init(sprite, sprite_json);
      self.sprites[sprite.name] = sprite;
    }

    var layer_json = self.map["layers"]["main"];
    var layer = new Layer();
    layer.init(layer, layer_json);
    self.layers[layer.name] = layer;
  },

  draw: function(self) {
    var layer = self.layers["main"];
    layer.draw(layer);
  }
};

var map = new Map();
function Layer() {};

Layer.prototype = {
  name: name,
  adjacency_dct: {},
  proxys: [],

  init: function(self, layer_json) {
    self.name = layer_json["name"];
    self.adjacency_dct = layer_json["adjacency_dct"];
    var objects = layer_json["objects"];
    for (var i = 0; i < objects.length; i++) {
      var proxy_json = objects[i];
      var proxy = new Proxy();
      proxy.init(proxy, proxy_json);
      self.proxys.push(proxy);
    }
  },

  draw: function(self) {
    for (var i = 0; i < self.proxys.length; i++) {
      var proxy = self.proxys[i];
      proxy.draw(proxy);
    }
  }
};

function Proxy() {};

Proxy.prototype = {
  position: null,
  name: null,
  sprite: null,
  frame: 0,
  animated: false,
  frame_time: 0,

  frame_time_counter: 0,
  current_frame: 0,

  init: function(self, proxy_json) {
    self.name = proxy_json["name"];
    self.position = proxy_json["position"];
    self.frame = proxy_json["frame"];
    self.current_frame = self.frame;
    self.animated = proxy_json["animated"];
    self.frame_time = proxy_json["frame_time"];
    self.sprite = map.get_sprite_by_name(map, proxy_json["sprite_ref"]);
  },

  initFull: function (self, name, position, frame, animated, frame_time, sprite_name) {
    self.name = name;
    self.position = [position[0], position[1]];
    self.frame = frame;
    self.current_frame = self.frame;
    self.animated = animated;
    self.frame_time = frame_time;
    self.sprite = map.get_sprite_by_name(map, sprite_name);    
  },

  set_position: function(self, pos) {
    self.position[0] = pos[0];
    self.position[1] = pos[1];
  },

  get_position: function(self) {
    return [self.position[0], self.position[1]];
  },

  set_frame: function(self, frame) {
    self.current_frame = frame;
  },

  get_dimensions: function(self) {
    return self.sprite.get_dimensions(self.sprite, self.current_frame);
  },

  draw: function(self) {
    if (self.animated) {
      self.frame_time_counter ++;
      if (self.frame_time_counter > self.frame_time) {
        self.frame_time_counter = 0;
        self.current_frame = self.current_frame + 1;
        self.current_frame = self.current_frame % self.sprite.get_n_frames(self.sprite);
      }
    }
    self.sprite.drawFrame(self.sprite, self.current_frame, self.position[0], self.position[1]);
  }
};

function GameLogic() {};

GameLogic.prototype = {
  default_velocity: 0,
  const_new_car_timeout: 4,
  const_ticks_in_s: gamescreen.const_fps,
  const_ms_in_s: 1000,

  train_proxy: null,
  adj_graph: null,
  wpoints: null,
  dir_sin: 0,
  dir_cos: 0,
  dir_pt: 0,
  dir_ang: 0,

  init_wpt: function(self) {
    var objs = map.map["layers"]["waypoints"]["objects"];
    self.wpoints = {};
    for (var i = 0; i < objs.length; i++) {
      self.wpoints[objs[i].id] = objs[i]["position"];
    }
  },

  calc_direction: function(self, pt, dir_pt) {
    var sx = pt[0];
    var sy = pt[1];

    var ex = dir_pt[0];
    var ey = dir_pt[1];

    self.dir_ang = Math.atan2(ey - sy, ex - sx) - Math.PI/2;
    self.dir_sin = -Math.sin(self.dir_ang);
    self.dir_cos = Math.cos(self.dir_ang);

    var angle = self.dir_ang;
    if (angle < 0) {
      angle += Math.PI*2;
    }
    angle = angle * 8;
    angle = angle/(2*Math.PI);
    angle = Math.round(angle) - 1;
    if (angle < 0) {
      angle += 8;
    }
    if (angle >= 8) {
      angle = 0;
    }
    self.train_proxy.set_frame(self.train_proxy, angle);
    console.log ("settings frame:"+angle);
  },

  init: function(self) {
    self.init_wpt(self);
    self.train_proxy = new Proxy();
    self.train_proxy.initFull(self.train_proxy, "steam_locomotive", self.wpoints[0], 1, false, 1, "steam_locomotive");
    var dimensions = self.train_proxy.get_dimensions(self.train_proxy);
    var pos = self.wpoints[0];
    self.train_proxy.set_position(self.train_proxy, [pos[0]-dimensions[0]/2, pos[1]-dimensions[1]/2]);

    console.log("proxy pos:"+[pos[0]-dimensions[0]/2, pos[1]-dimensions[1]/2]);
    self.adj_graph = map.map["layers"]["waypoints"]["adjacency_dct"];
    self.dir_pt = self.adj_graph[self.dir_pt][0];
    console.log("direction point:"+self.dir_pt);
    console.log("dir point pos:"+self.wpoints[self.dir_pt]);
    
    self.default_velocity = gamescreen.height/20;
    self.calc_direction(self, self.wpoints[0], self.wpoints[self.dir_pt]);
  },

  draw: function(self) {
    self.train_proxy.draw(self.train_proxy);
    var dt = 1.0/30.0;
    var pos = self.train_proxy.get_position(self.train_proxy);
    var dimensions = self.train_proxy.get_dimensions(self.train_proxy);
    var real_pos = [self.wpoints[self.dir_pt][0]-dimensions[0]/2, self.wpoints[self.dir_pt][1]-dimensions[1]/2];
    var dist = pt_to_pt_dist(pos, real_pos);
    //console.log("dist:"+dist);
    if (dist<2.0) {
      var new_dir_pt = self.adj_graph[self.dir_pt][0];
      self.calc_direction(self, self.wpoints[self.dir_pt], self.wpoints[new_dir_pt]);
      self.dir_pt = new_dir_pt;
      //console.log("new pt:"+self.dir_pt);
    }
    pos[0] += self.dir_sin*dt*self.default_velocity;
    pos[1] += self.dir_cos*dt*self.default_velocity;
    self.train_proxy.set_position(self.train_proxy, pos);
    
    //draw score
    gamescreen.put_text(gamescreen, "bold 20px Arial", "black", "Score: "+self.score, 100, 100);
  }
};

var gamelogic = new GameLogic();
var logic = function() {
  console.log("loaded");
  map.init(map);
  gamescreen.init(gamescreen);
  gamelogic.init(gamelogic);

  gamescreen.set_keydown_cb(gamescreen, function(kc) {
    gamelogic.keydown(gamelogic, kc);
  });

  var drawAll = function() {
    map.draw(map);
    gamelogic.draw(gamelogic);
  };

  window.setInterval(function() {
    gamescreen.draw(gamescreen, drawAll);
  }, gamescreen.frame_timeout);
};

document.addEventListener("DOMContentLoaded", logic, false);
