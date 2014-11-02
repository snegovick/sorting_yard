function Car() {};

Car.prototype = {
  dir_sin: 0,
  dir_cos: 0,
  dir_pt: 0,
  dir_ang: 0,
  dist_lookback: null,
  proxy: null,
  velocity: 0,
  wpoints: null,
  adj_graph: null,
  head: null,
  cars: null,
  dist: 0,

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
    self.proxy.set_frame(self.proxy, angle);
    console.log ("settings frame:"+angle);
  },

  set_head: function(self, head) {
    head.add_cars(head, [self]);
    if (self.cars.length > 0) {
      head.add_cars(head, self.cars);
      self.cars = [];
    }
    self.head = head;
  },

  get_velocity: function(self) {
    return self.velocity;
  },

  add_cars: function(self, cars) {
    for (var i = 0; i < cars.length; i++) {
      self.cars.push(cars[i]);
    }
  },

  set_velocity: function(self, velocity) {
    self.velocity = velocity;
  },

  get_distance: function(self) {
    return self.dist;
  },
  
  init: function(self, velocity, sprite_name) {
    self.dist_lookback = [];
    self.cars = [];
    self.velocity = velocity;

    self.proxy = new Proxy();
    self.wpoints = gamelogic.get_waypoints(gamelogic);
    self.adj_graph = gamelogic.get_adj_graph(gamelogic);
    self.proxy.initFull(self.proxy, sprite_name, self.wpoints[0], 1, false, 1, sprite_name);
    var dimensions = self.proxy.get_dimensions(self.proxy);
    var pos = self.wpoints[0];
    self.proxy.set_position(self.proxy, [pos[0]-dimensions[0]/2, pos[1]-5*dimensions[1]/7]);

    self.dir_pt = self.adj_graph[self.dir_pt][0];
    console.log("direction point:"+self.dir_pt);
    console.log("dir point pos:"+self.wpoints[self.dir_pt]);

    self.calc_direction(self, self.wpoints[0], self.wpoints[self.dir_pt]);
  },

  draw: function(self) {
    self.proxy.draw(self.proxy);

    var velocity = self.velocity;
    if (self.head != null) {
      velocity = self.head.get_velocity(self.head);
    }

    if (velocity != 0) {
      var dt = 1.0/30.0;
      var pos = self.proxy.get_position(self.proxy);
      var dimensions = self.proxy.get_dimensions(self.proxy);
      var dest_real_pos = [self.wpoints[self.dir_pt][0]-dimensions[0]/2, self.wpoints[self.dir_pt][1]-5*dimensions[1]/7];
      var dist = pt_to_pt_dist(pos, dest_real_pos);

      // look back for collision (if the distance to destination point was decreasing and then started increasing, then we might missed it)
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
          self.proxy.set_position(self.proxy, dest_real_pos);
          self.dir_pt = new_dir_pt;
          //console.log("new pt:"+self.dir_pt);
        }
      }
      self.dist += dt*velocity;
      pos[0] += self.dir_sin*dt*velocity;
      pos[1] += self.dir_cos*dt*velocity;
      self.proxy.set_position(self.proxy, pos);

    }
    for (var i = 0; i < self.cars.length; i++) {
      self.cars[i].draw(self.cars[i]);
      //console.log("drawing car:"+i);
    }
  }

};

