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

    self.cars.push({"position": [sx, sy], "orientation": 0.0, "heading_sin": 0.0, "heading_cos": 0.0, "velocity": self.default_velocity, "color": self.colors[get_random_int(0, self.colors.length-1)], "destination_pt": 1});
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
    self.cars.splice(cid, 1);
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
        console.log("checking switch");
        console.log("state:"+state);
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

  init_tasks: function(self) {
    // find leaves
    for (var p in map.map["rail_graph_adj_list"]) {
      if (p!=0) {
        if (map.map["rail_graph_adj_list"][p].length == 0) {
          
          self.tasks[p] = {};
          for (var i = 0; i < self.colors.length; i++) {
            self.tasks[p][self.colors[i]] = 0;
          }
          self.init_single_task(self, p);
        }
      }
    }
  },

  init_single_task: function(self, task_id) {
    for (var c in self.tasks[task_id]) {
      self.tasks[task_id][c] = get_random_int(0, 4);
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

  drawTasks: function(self) {
    for (var t in self.tasks) {
      tx = map.map["rail_points"][t][0]*gamescreen.width;
      ty = map.map["rail_points"][t][1]*gamescreen.height;
      var old_color = gamescreen.ctx.fillStyle;
      gamescreen.ctx.fillStyle = "blue";
      gamescreen.ctx.fillRect(tx-100, ty-100, 10, 10);
      gamescreen.ctx.fillStyle = old_color;
      gamescreen.ctx.fillText("x"+self.tasks[t]["blue"], tx-80, ty-95);

      gamescreen.ctx.fillStyle = "green";
      gamescreen.ctx.fillRect(tx-100, ty-50, 10, 10);
      gamescreen.ctx.fillStyle = old_color;      
      gamescreen.ctx.fillText("x"+self.tasks[t]["green"], tx-80, ty-45);

      gamescreen.ctx.fillStyle = "red";
      gamescreen.ctx.fillRect(tx-100, ty, 10, 10);
      gamescreen.ctx.fillStyle = old_color;
      
      gamescreen.ctx.fillText("x"+self.tasks[t]["red"], tx-80, ty+5);
    }
  },

  init: function(self) {
    self.default_velocity = gamescreen.height/10;
    self.init_tasks(self);
    self.init_switches(self);
  },

  draw: function(self) {
    self.displayRailNode(self, 0);
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
    
  }
};

var gamelogic = new GameLogic();
