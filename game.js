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
function Sprite() {};

Sprite.prototype = {
  paths: [],
  img_objects: [],
  frame_time: 1,
  current_frame: 0,
  frame_time_counter: 0,

  init: function(self, path) {
    self.this = self;
    self.paths.push(path);
  },

  initMultiPath: function(self, paths, frame_time) {
    self.paths = paths;
    self.animation_speed = frame_time;
    self.loadImages(self);
  },

  loadImages: function(self) {
    for (var i = 0; i < self.paths.length; i++) {
      var img = new Image();
      img.src = self.paths[i];
      self.img_objects.push(img);
    }
  },

  drawFrame: function(self, frame, x, y) {
    var img = self.img_objects[frame];
    gamescreen.ctx.drawImage(img, x-img.width/2, y-img.height/2);
  },

  draw: function(self, x, y) {
    self.frame_time_counter ++;
    if (self.frame_time_counter > self.frame_time) {
      self.frame_time_counter = 0;
      self.current_frame = self.current_frame + 1;
      self.current_frame = self.current_frame % self.img_objects.length;
    }
    self.drawFrame(self, self.current_frame);
  }

};

function Map() {};

Map.prototype = {
  map: {
    "rail_points": {
      0: [0.5, 0.1],
      1: [0.5, 0.3],
      2: [0.5, 0.4],
      3: [0.5, 0.9],
      
      4: [0.2, 0.473],
      5: [0.2, 0.9],
      
      6: [0.7, 0.515],
      7: [0.7, 0.9]
    },

    "rail_graph_adj_list": {
      0: [1],
      1: [2, 4],
      2: [3, 6],
      3: [],
      4: [5],
      5: [],
      6: [7],
      7: []
    },

    "sprites": {
      "red_tank": [
        "./sprites/128_red_tank/128_red_tank_1.png",
        "./sprites/128_red_tank/128_red_tank_2.png",
        "./sprites/128_red_tank/128_red_tank_3.png",
        "./sprites/128_red_tank/128_red_tank_4.png",
        "./sprites/128_red_tank/128_red_tank_5.png",
        "./sprites/128_red_tank/128_red_tank_6.png",
        "./sprites/128_red_tank/128_red_tank_7.png",
        "./sprites/128_red_tank/128_red_tank_8.png"
      ]
    }
  },

  sprites: {
    "red_tank": null
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
      console.log(str+"angle:", angle);
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
    self.displayRailNode(self, 0, true);
    self.drawTasks(self);

    self.second_ctr ++;
    if (self.second_ctr > self.const_ticks_in_s) {
      self.second_ctr = 0;
      self.new_car_ctr ++;
      if (self.new_car_ctr > self.const_new_car_timeout) {
        self.new_car_ctr = 0;
        if (!self.level_stop) {
          self.mk_car(self);
        }
      }
    }

    //console.log("cars length:"+self.cars.length);
    for (var i = 0; i < self.cars.length; i++) {
      self.displayCar(self, i);
      if (!self.level_stop) {
        if (!self.advanceCar(self, i)) {
          i-=1;
        }
      }
    }

    for (var t in self.trains) {
      for (var i = 0; i < self.trains[t]["cars"].length; i++) {
        var car = self.trains[t]["cars"][i];
        self.displayStoppedCar(self, car);
      }
    }
    
    if (self.level_stop) {
      var old_font = gamescreen.ctx.font;
      var go = "GAME OVER";
      var go_width = go.length*24;
      var go_height = 24;
      gamescreen.ctx.font = "bold 24px Arial";
      gamescreen.ctx.fillText(go, gamescreen.width/2-go_width/2, gamescreen.height/2-go_height/2);
      gamescreen.ctx.font = old_font;
    }

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
