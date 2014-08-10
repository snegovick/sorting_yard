var pt_to_pt_dist = function(p1, p2) {
  var x = (p1[0]-p2[0]);
  var y = (p1[1]-p2[1]);
  return Math.sqrt(x*x+y*y);
};
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
    self.canvas.width = window.innerWidth;
    self.canvas.height = window.innerHeight;
    self.width = self.canvas.width;
    self.height = self.canvas.height;
    self.ctx = self.canvas.getContext("2d");
  },

  set_keydown_cb: function(self, cb) {
    window.addEventListener('keydown', cb, true);
  },

  draw: function(self, callback) {
    self.ctx.clearRect(0, 0, self.width, self.height);
    callback();
  }
};

var gamescreen = new GameScreen();
function Map() {};

Map.prototype = {
  map: {
    "rail_points": {
      0: [0.5, 0.1],
      1: [0.5, 0.3],
      2: [0.5, 0.4],
      3: [0.5, 0.9],
      
      4: [0.2, 0.6],
      5: [0.2, 0.9],
      
      6: [0.7, 0.6],
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
    }
  },


  init: function(self) {
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
  const_new_car_timeout: 2,
  const_ticks_in_s: gamescreen.const_fps,
  const_ms_in_s: 1000,
  second_ctr: 0,
  new_car_ctr: 0,

  cars: [],
  stopped_cars: {},
  switches: {},

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

    self.cars.push({"position": [sx, sy], "orientation": 0.0, "heading_sin": 0.0, "heading_cos": 0.0, "velocity": self.default_velocity, "color": "blue", "destination_pt": 1});
    self.__calc_orientation(self, self.cars.length-1, 0, 1);
  },

  move_car_to_stopped: function(self, cid, dest_pt_id) {
    if (dest_pt_id in self.stopped_cars) {
      self.stopped_cars[dest_pt_id].push(self.cars[cid]);
    } else {
      self.stopped_cars[dest_pt_id] = [self.cars[cid]];
    }
    self.cars.splice(cid, 1);
  },

  checkStoppedCars: function(self, cid, dest_pt_id, current_pt_id) {
    var car_pos = self.cars[cid]["position"];
    if (dest_pt_id in self.stopped_cars) {
      for (var i = 0; i < self.stopped_cars[dest_pt_id].length; i++) {
        var oc = self.stopped_cars[dest_pt_id][i];
        var oc_pos = oc["position"];
        if (pt_to_pt_dist(oc_pos, car_pos) < self.car_h*1.5) {
          self.move_car_to_stopped(self, cid, current_pt_id);
          return true;
        }
      }
    }
    return false;
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
    if (self.checkStoppedCars(self, cid, dest_pt_id, dest_pt_id)) {
      return false;
    }
    
    for (var i = 0; i < map.map["rail_graph_adj_list"][dest_pt_id].length; i++) {
      //console.log("checking: "+map["rail_graph_adj_list"][dest_pt_id][i]);
      if (self.checkStoppedCars(self, cid, map.map["rail_graph_adj_list"][dest_pt_id][i], dest_pt_id)) {
        return false;
      }
    }

    if (pt_to_pt_dist(car_pos, dest_pt) <= 2) {
      if (dest_pt_id in self.switches) {
        var state = self.switches[dest_pt_id]["state"];
        console.log("checking switch");
        console.log("state:"+state);
        var new_dest_pt_id = map.map["rail_graph_adj_list"][dest_pt_id][state];
        self.cars[cid]["destination_pt"] = new_dest_pt_id;
        self.__calc_orientation(self, cid, dest_pt_id, new_dest_pt_id);
      } else {
        if (map.map["rail_graph_adj_list"][dest_pt_id].length == 0) {
          self.cars[cid]["velocity"] = 0;
          self.move_car_to_stopped(self, cid, dest_pt_id);
          return false;
        } else {
          var new_dest_pt_id = map.map["rail_graph_adj_list"][dest_pt_id][0];
          self.cars[cid]["destination_pt"] = new_dest_pt_id;
          self.__calc_orientation(self, cid, dest_pt_id, new_dest_pt_id);
        }
      }
      console.log("new destination pt for car["+cid+"] : "+self.cars[cid]["destination_pt"]);
    }
    return true;
  },

  displayCar: function(self, cid) {
    var angle = self.cars[cid]["orientation"];
    var cx = self.cars[cid]["position"][0];
    var cy = self.cars[cid]["position"][1];
    var vel = self.cars[cid]["velocity"];
    var color = self.cars[cid]["color"];

    gamescreen.ctx.translate(cx, cy);
    gamescreen.ctx.rotate(angle);
    var old_color = gamescreen.ctx.fillStyle;
    gamescreen.ctx.fillStyle = color;
    gamescreen.ctx.fillRect(-self.car_w/2, -self.car_h/2, self.car_w, self.car_h);
    gamescreen.ctx.fillStyle = old_color;
    gamescreen.ctx.rotate(-angle);
    gamescreen.ctx.translate(-cx, -cy);
  },

  displayStoppedCar: function(self, car) {
    var angle = car["orientation"];
    var cx = car["position"][0];
    var cy = car["position"][1];
    var vel = car["velocity"];
    var color = car["color"];

    gamescreen.ctx.translate(cx, cy);
    gamescreen.ctx.rotate(angle);
    var old_color = gamescreen.ctx.fillStyle;
    gamescreen.ctx.fillStyle = color;
    gamescreen.ctx.fillRect(-self.car_w/2, -self.car_h/2, self.car_w, self.car_h);
    gamescreen.ctx.fillStyle = old_color;
    gamescreen.ctx.rotate(-angle);
    gamescreen.ctx.translate(-cx, -cy);
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

  displayRailNode: function(self, n) {
    //console.log("drawing "+n);
    var pt_width = 5;
    var cx = map.map["rail_points"][n][0]*gamescreen.width;
    var cy = map.map["rail_points"][n][1]*gamescreen.height;
    gamescreen.ctx.fillRect(cx-pt_width/2, cy-pt_width/2, pt_width, pt_width);
    var n_beams = map.map["rail_graph_adj_list"][n].length;
    if (n_beams > 0) {
      // display switch controls
      if (n_beams > 1) {
        gamescreen.ctx.fillText(self.switches[n]["id"], cx-20, cy-20)
      }

      // draw outgoint beams
      for (var i = 0; i < map.map["rail_graph_adj_list"][n].length; i++) {
        p = map.map["rail_graph_adj_list"][n][i];
        gamescreen.ctx.beginPath();
        gamescreen.ctx.moveTo(cx, cy);
        var ox = map.map["rail_points"][p][0]*gamescreen.width;
        var oy = map.map["rail_points"][p][1]*gamescreen.height;
        gamescreen.ctx.lineTo(ox, oy);
        gamescreen.ctx.stroke();
        self.displayRailNode(self, p);
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

  init: function(self) {
    self.default_velocity = gamescreen.height/10;
    self.init_switches(self);
  },

  draw: function(self) {
    self.displayRailNode(self, 0);

    self.second_ctr ++;
    if (self.second_ctr > self.const_ticks_in_s) {
      self.second_ctr = 0;
      self.new_car_ctr ++;
      if (self.new_car_ctr > self.const_new_car_timeout) {
        self.new_car_ctr = 0;
        self.mk_car(self);
      }
    }

    //console.log("cars length:"+self.cars.length);
    for (var i = 0; i < self.cars.length; i++) {
      self.displayCar(self, i);
      if (!self.advanceCar(self, i)) {
        i-=1;
      }
    }

    for (var k in self.stopped_cars) {
      for (var i = 0; i < self.stopped_cars[k].length; i++) {
        var car = self.stopped_cars[k][i];
        self.displayStoppedCar(self, car);
      }
    }

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
