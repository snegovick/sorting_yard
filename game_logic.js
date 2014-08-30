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
  dist_lookback: [],

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
    self.train_proxy.set_position(self.train_proxy, [pos[0]-dimensions[0]/2, pos[1]-5*dimensions[1]/7]);

    console.log("proxy pos:"+[pos[0]-dimensions[0]/2, pos[1]-5*dimensions[1]/7]);
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
    var dest_real_pos = [self.wpoints[self.dir_pt][0]-dimensions[0]/2, self.wpoints[self.dir_pt][1]-5*dimensions[1]/7];
    var dist = pt_to_pt_dist(pos, dest_real_pos);
    self.dist_lookback.push(dist);
    if (self.dist_lookback.length >= 4) {
      self.dist_lookback.shift();
      //console.log("dist:"+dist);
      if (self.dist_lookback[2]>self.dist_lookback[1]) {
        console.log("slip!:"+self.dist_lookback);
        self.dist_lookback = [];
        // }
        // if (dist<2.0) {
        var new_dir_pt = self.adj_graph[self.dir_pt][0];
        var dest_pos = self.wpoints[self.dir_pt];
        self.calc_direction(self, dest_pos, self.wpoints[new_dir_pt]);
        self.train_proxy.set_position(self.train_proxy, dest_real_pos);
        self.dir_pt = new_dir_pt;
        //console.log("new pt:"+self.dir_pt);
      }
    }
    pos[0] += self.dir_sin*dt*self.default_velocity;
    pos[1] += self.dir_cos*dt*self.default_velocity;
    self.train_proxy.set_position(self.train_proxy, pos);
    
    //draw score
    gamescreen.put_text(gamescreen, "bold 20px Arial", "black", "Score: "+self.score, 100, 100);
  }
};

var gamelogic = new GameLogic();
