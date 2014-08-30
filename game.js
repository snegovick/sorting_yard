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
  const_fps: 1,
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

  draw: function(self, x, y) {
    // console.log("x, y: "+x+", "+y);
    // console.log("origin: "+self.origin);
    // console.log("dimensions: "+self.dimensions);
    gamescreen.ctx.drawImage(map.atlas, 
                             self.origin[0], self.origin[1], 
                             self.dimensions[0], self.dimensions[1], 
                             x-self.dimensions[0]/2, y-self.dimensions[1]/2,
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
  map: {"layers": [{"adjacency_dct": {}, "type": "layer", "name": "main", "objects": [{"sprite_ref": "rail", "name": "4", "position": [448, 0], "frame": 4, "animated": false, "type": "proxy", "id": 4, "frame_time": 10}, {"sprite_ref": "rail", "name": "7", "position": [384, 32], "frame": 4, "animated": false, "type": "proxy", "id": 7, "frame_time": 10}, {"sprite_ref": "rail", "name": "5", "position": [512, 32], "frame": 4, "animated": false, "type": "proxy", "id": 5, "frame_time": 10}, {"sprite_ref": "rail", "name": "6", "position": [448, 64], "frame": 4, "animated": false, "type": "proxy", "id": 6, "frame_time": 10}, {"sprite_ref": "rail", "name": "9", "position": [576, 64], "frame": 4, "animated": false, "type": "proxy", "id": 9, "frame_time": 10}, {"sprite_ref": "rail", "name": "8", "position": [512, 96], "frame": 4, "animated": false, "type": "proxy", "id": 8, "frame_time": 10}]}], "grid_step": [32, 32], "map_size": [256, 256], "format": 1, "images": {"red_tank_0001.png": {"origin": [896, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0001.png"}, "straight_angle_rail_0003.png": {"origin": [0, 512], "type": "image", "dimensions": [128, 256], "name": "straight_angle_rail_0003.png"}, "straight_angle_rail_0001.png": {"origin": [256, 512], "type": "image", "dimensions": [128, 256], "name": "straight_angle_rail_0001.png"}, "red_tank_0005.png": {"origin": [384, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0005.png"}, "red_tank_0004.png": {"origin": [0, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0004.png"}, "red_tank_0006.png": {"origin": [768, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0006.png"}, "locomotive_0007.png": {"origin": [0, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0007.png"}, "locomotive_0004.png": {"origin": [384, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0004.png"}, "locomotive_0005.png": {"origin": [256, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0005.png"}, "clean_tile_0000.png": {"origin": [512, 512], "type": "image", "dimensions": [128, 256], "name": "clean_tile_0000.png"}, "straight_rail_0001.png": {"origin": [640, 512], "type": "image", "dimensions": [128, 256], "name": "straight_rail_0001.png"}, "straight_rail_0000.png": {"origin": [768, 512], "type": "image", "dimensions": [128, 256], "name": "straight_rail_0000.png"}, "red_tank_0003.png": {"origin": [640, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0003.png"}, "red_tank_0007.png": {"origin": [128, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0007.png"}, "locomotive_0006.png": {"origin": [128, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0006.png"}, "straight_angle_rail_0002.png": {"origin": [128, 512], "type": "image", "dimensions": [128, 256], "name": "straight_angle_rail_0002.png"}, "locomotive_0002.png": {"origin": [640, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0002.png"}, "straight_angle_rail_0000.png": {"origin": [384, 512], "type": "image", "dimensions": [128, 256], "name": "straight_angle_rail_0000.png"}, "red_tank_0000.png": {"origin": [512, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0000.png"}, "red_tank_0002.png": {"origin": [256, 768], "type": "image", "dimensions": [128, 128], "name": "red_tank_0002.png"}, "locomotive_0003.png": {"origin": [512, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0003.png"}, "locomotive_0000.png": {"origin": [896, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0000.png"}, "locomotive_0001.png": {"origin": [768, 896], "type": "image", "dimensions": [128, 128], "name": "locomotive_0001.png"}}, "type": "map", "sprites": {"steam_locomotive": {"type": "sprite", "name": "steam_locomotive", "image_refs": ["locomotive_0007.png", "locomotive_0006.png", "locomotive_0005.png", "locomotive_0004.png", "locomotive_0003.png", "locomotive_0002.png", "locomotive_0001.png", "locomotive_0000.png"]}, "rail": {"type": "sprite", "name": "rail", "image_refs": ["straight_angle_rail_0003.png", "straight_angle_rail_0002.png", "straight_angle_rail_0001.png", "straight_angle_rail_0000.png", "clean_tile_0000.png", "straight_rail_0001.png", "straight_rail_0000.png"]}, "red_tank_car": {"type": "sprite", "name": "red_tank_car", "image_refs": ["red_tank_0004.png", "red_tank_0007.png", "red_tank_0002.png", "red_tank_0005.png", "red_tank_0000.png", "red_tank_0003.png", "red_tank_0006.png", "red_tank_0001.png"]}}, "atlas_path": "media/tilesets/level_0.png"},
  
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

    for (var l in self.map["layers"]) {
      var layer_json = self.map["layers"][l];
      var layer = new Layer();
      layer.init(layer, layer_json);
      self.layers[layer.name] = layer;
    }
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
  car_w: 30,
  car_h: 60,
  const_new_car_timeout: 4,
  const_ticks_in_s: gamescreen.const_fps,
  const_ms_in_s: 1000,
  second_ctr: 0,
  new_car_ctr: 0,

  cars: [],
  switches: {},
  level_stop: false,
  score: 0,
  tasks: {},
  colors: ["blue", "green", "red"],
  trains: {},

  __calc_orientation: function(self, cid, start_pt_id, end_pt_id) {
    var sx = map.map["rail_points"][start_pt_id][0]*gamescreen.width;
    var sy = map.map["rail_points"][start_pt_id][1]*gamescreen.height;
    
    var ex = map.map["rail_points"][end_pt_id][0]*gamescreen.width;
    var ey = map.map["rail_points"][end_pt_id][1]*gamescreen.height;

    var orientation = Math.atan2(ey-sy, ex-sx) - Math.PI/2;

    var heading_sin = -Math.sin(orientation);
    var heading_cos = Math.cos(orientation);
    self.cars[cid]["heading_sin"] = heading_sin;
    self.cars[cid]["heading_cos"] = heading_cos;
    self.cars[cid]["orientation"] = orientation;
    
  },

  mk_car: function(self) {
    var sx = map.map["rail_points"][0][0]*gamescreen.width;
    var sy = map.map["rail_points"][0][1]*gamescreen.height;

    self.cars.push({"position": [sx, sy], "orientation": 0.0, "heading_sin": 0.0, "heading_cos": 0.0, "velocity": self.default_velocity, "color": self.colors[get_random_int(0, self.colors.length)], "destination_pt": 1});
    self.__calc_orientation(self, self.cars.length-1, 0, 1);
  },

  move_car_to_stopped: function(self, cid, dest_pt_id) {
    self.trains[dest_pt_id]["cars"].push(self.cars[cid]);
    self.trains[dest_pt_id][self.cars[cid]["color"]] += 1;
    self.tasks[dest_pt_id][self.cars[cid]["color"]] -= 1;

    var start = [map.map["rail_points"][0][0]*gamescreen.width,
                 map.map["rail_points"][0][1]*gamescreen.height];

    if (pt_to_pt_dist(self.cars[cid]["position"], start) < self.car_h*1.5) {
      self.level_stop = true;
    }
    if (self.checkIfTaskComplete(self, dest_pt_id)) {
      self.score += self.calcScore(self, dest_pt_id);
      delete self.trains[dest_pt_id];
      self.init_single_task(self, dest_pt_id);
    }
    self.cars.splice(cid, 1);
  },

  calcScore: function(self, tid) {
    var score = 0;
    var multiplier = 10;
    for (var i = 0; i < self.colors.length; i++) {
      var color = self.colors[i];
      var cur = self.tasks[tid][color];
      var target = self.tasks[tid]["orig_task"][color];
      var sum = cur+target;
      console.log(sum);
      score+=sum*multiplier;
    }
    return score;
  },

  checkIfTaskComplete: function(self, tid) {
    for (var i = 0; i < self.colors.length; i++) {
      if (self.tasks[tid][self.colors[i]]>0) {
        return false;
      }
    }
    return true;
  },

  checkStoppedCars: function(self, cid) {
    var car_pos = self.cars[cid]["position"];
    for (var t in self.trains) {
      var cars = self.trains[t]["cars"];
      var oc = cars[cars.length-1];
      var oc_pos = oc["position"];
      if (pt_to_pt_dist(oc_pos, car_pos) < self.car_h*1.5) {
        self.move_car_to_stopped(self, cid, t);
        return true; 
      }
    }
    return false;
  },

  __mk_train: function(self, train_id) {
    self.trains[train_id] = {"cars": []};
    for (var i = 0; i < self.colors.length; i++) {
      self.trains[train_id][self.colors[i]] = 0;
    }
  },

  advanceCar: function(self, cid) {
    var ds = self.cars[cid]["velocity"]*gamescreen.const_fps/self.const_ms_in_s;
    self.cars[cid]["position"][0] += self.cars[cid]["heading_sin"]*ds;
    self.cars[cid]["position"][1] += self.cars[cid]["heading_cos"]*ds;
    var car_pos = self.cars[cid]["position"];
    var dest_pt_id = self.cars[cid]["destination_pt"];
    var dest_pt = [map.map["rail_points"][dest_pt_id][0]*gamescreen.width, map.map["rail_points"][dest_pt_id][1]*gamescreen.height];
    var dist = pt_to_pt_dist(car_pos, dest_pt);
    
    //check stopped cars in current dest and adjacent pts
    //console.log("checking:"+dest_pt_id);
    if (self.checkStoppedCars(self, cid)) {
      return false;
      // add car to the train
    }
    
    for (var i = 0; i < map.map["rail_graph_adj_list"][dest_pt_id].length; i++) {
      //console.log("checking: "+map["rail_graph_adj_list"][dest_pt_id][i]);
      if (self.checkStoppedCars(self, cid)) {
        // add car to the train
        return false;
      }
    }

    if (pt_to_pt_dist(car_pos, dest_pt) <= 2) {
      if (dest_pt_id in self.switches) {
        var state = self.switches[dest_pt_id]["state"];
        //console.log("checking switch");
        //console.log("state:"+state);
        var new_dest_pt_id = map.map["rail_graph_adj_list"][dest_pt_id][state];
        self.cars[cid]["destination_pt"] = new_dest_pt_id;
        self.__calc_orientation(self, cid, dest_pt_id, new_dest_pt_id);
      } else {
        if (map.map["rail_graph_adj_list"][dest_pt_id].length == 0) {
          // first car in the train
          self.trains[dest_pt_id] = {"cars": [], };
          self.cars[cid]["velocity"] = 0;
          self.move_car_to_stopped(self, cid, dest_pt_id);
          return false;
        } else {
          var new_dest_pt_id = map.map["rail_graph_adj_list"][dest_pt_id][0];
          self.cars[cid]["destination_pt"] = new_dest_pt_id;
          self.__calc_orientation(self, cid, dest_pt_id, new_dest_pt_id);
        }
      }
      //console.log("new destination pt for car["+cid+"] : "+self.cars[cid]["destination_pt"]);
    }
    return true;
  },

  displaySingleCar: function(self, car) {
    var angle = car["orientation"];
    var cx = car["position"][0];
    var cy = car["position"][1];
    var vel = car["velocity"];
    var color = car["color"];

    if (color == "red") {
      var sprite = map.sprites["red_tank"];
      if (angle<0) {
        angle += Math.PI*2;
      }
      var str = "orig angle:"+angle+" ";
      angle = angle * 8;
      angle = angle/(2*Math.PI);
      angle = Math.round(angle);
      //console.log(str+"angle:", angle);
      if (angle>=8) {
        angle = 0;
      }
      sprite.drawFrame(sprite, angle, cx, cy);
    } else {
      gamescreen.put_rect(gamescreen, color, angle, cx, cy, self.car_w, self.car_h);
    }

  },

  displayCar: function(self, cid) {
    self.displaySingleCar(self, self.cars[cid]);
  },

  displayStoppedCar: function(self, car) {
    self.displaySingleCar(self, car);
  },

  init_switches: function(self) {
    var switch_ctr = 1;
    for (var p in map.map["rail_graph_adj_list"]) {
      if (map.map["rail_graph_adj_list"][p].length > 1) {
        self.switches[p] = {"state": 0, "id": switch_ctr};
        switch_ctr += 1;
      }
    }
  },

  init_tasks: function(self) {
    // find leaves
    for (var p in map.map["rail_graph_adj_list"]) {
      if (p!=0) {
        if (map.map["rail_graph_adj_list"][p].length == 0) {
          
          self.tasks[p] = {};
          for (var i = 0; i < self.colors.length; i++) {
            self.tasks[p][self.colors[i]] = 0;
            self.tasks[p]["orig_task"] = {};
            self.tasks[p]["orig_task"][self.colors[i]] = 0;
          }
          self.init_single_task(self, p);
        }
      }
    }
  },

  init_single_task: function(self, task_id) {
    for (var i = 0; i < self.colors.length; i++) {
      var c = self.colors[i];
      var value = get_random_int(0, 4);
      self.tasks[task_id][c] = value;
      self.tasks[task_id]["orig_task"][c] = value;
    }
  },

  displayRailNode: function(self, n, prev_green) {
    //console.log("drawing "+n);
    var pt_width = 5;
    var cx = map.map["rail_points"][n][0]*gamescreen.width;
    var cy = map.map["rail_points"][n][1]*gamescreen.height;
    gamescreen.ctx.fillRect(cx-pt_width/2, cy-pt_width/2, pt_width, pt_width);
    var n_beams = map.map["rail_graph_adj_list"][n].length;
    if (n_beams > 0) {
      // display switch controls
      var beam = 0;
      if (n_beams > 1) {
        gamescreen.put_text(gamescreen, "bold 16px Arial", "black", self.switches[n]["id"], cx-20, cy-20);
        beam = self.switches[n]["state"];
      }

      // draw outgoint beams
      for (var i = 0; i < map.map["rail_graph_adj_list"][n].length; i++) {
        p = map.map["rail_graph_adj_list"][n][i];
        var style = "black";
        if (prev_green) {
          if (i == beam) {
            style = "green";
          }
        }
        var ox = map.map["rail_points"][p][0]*gamescreen.width;
        var oy = map.map["rail_points"][p][1]*gamescreen.height;

        gamescreen.put_line(gamescreen, style, cx, cy, ox, oy);
        self.displayRailNode(self, p, style == "green");
      }
    }
  },

  keydown: function(self, evt) {
    console.log(evt);
    if (evt.keyCode >= 49 && evt.keyCode <= 57) {
      console.log("turning switch");
      var sid = evt.keyCode - 49 + 1;
      console.log("sid:"+sid);
      for (var s in self.switches) {
        if (s == sid) {
          var state = self.switches[s]["state"];
          if (state == 0) {
            self.switches[s]["state"] = 1;
          } else {
            self.switches[s]["state"] = 0;
          }
          console.log("new switch state:"+self.switches[s]["state"]);
        }
      }
    }
  },

  drawTasks: function(self) {
    for (var t in self.tasks) {
      var tx = map.map["rail_points"][t][0]*gamescreen.width;
      var ty = map.map["rail_points"][t][1]*gamescreen.height;
      var old_color = gamescreen.ctx.fillStyle;
      var spread = 30;
      for (var i = 0; i < self.colors.length; i++) {
        gamescreen.put_rect(gamescreen, self.colors[i], 0, tx - 100, ty - i*spread, 10, 10);
        gamescreen.put_text(gamescreen, "bold 16px Arial", "black", "x"+self.tasks[t][self.colors[i]], tx - 80, ty - i*spread+8);
      }
    }
  },

  init: function(self) {
    self.default_velocity = gamescreen.height/30;
    self.init_tasks(self);
    self.init_switches(self);
  },

  draw: function(self) {
    // self.displayRailNode(self, 0, true);
    // self.drawTasks(self);

    // self.second_ctr ++;
    // if (self.second_ctr > self.const_ticks_in_s) {
    //   self.second_ctr = 0;
    //   self.new_car_ctr ++;
    //   if (self.new_car_ctr > self.const_new_car_timeout) {
    //     self.new_car_ctr = 0;
    //     if (!self.level_stop) {
    //       self.mk_car(self);
    //     }
    //   }
    // }

    // //console.log("cars length:"+self.cars.length);
    // for (var i = 0; i < self.cars.length; i++) {
    //   self.displayCar(self, i);
    //   if (!self.level_stop) {
    //     if (!self.advanceCar(self, i)) {
    //       i-=1;
    //     }
    //   }
    // }

    // for (var t in self.trains) {
    //   for (var i = 0; i < self.trains[t]["cars"].length; i++) {
    //     var car = self.trains[t]["cars"][i];
    //     self.displayStoppedCar(self, car);
    //   }
    // }
    
    // if (self.level_stop) {
    //   var old_font = gamescreen.ctx.font;
    //   var go = "GAME OVER";
    //   var go_width = go.length*24;
    //   var go_height = 24;
    //   gamescreen.ctx.font = "bold 24px Arial";
    //   gamescreen.ctx.fillText(go, gamescreen.width/2-go_width/2, gamescreen.height/2-go_height/2);
    //   gamescreen.ctx.font = old_font;
    // }

    //draw score
    gamescreen.put_text(gamescreen, "bold 20px Arial", "black", "Score: "+self.score, 100, 100);
  }
};

var gamelogic = new GameLogic();
var logic = function() {
  console.log("loaded");

  gamescreen.init(gamescreen);
  map.init(map);
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
