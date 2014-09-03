function GameLogic() {};

GameLogic.prototype = {
  default_velocity: 0,
  const_new_car_timeout: 4,
  const_ticks_in_s: gamescreen.const_fps,
  const_ms_in_s: 1000,

  adj_graph: null,
  wpoints: null,

  train: null,

  cars_added: 0,
  last_distance: 0,

  get_waypoints: function(self) {
    return self.wpoints;
  },

  get_adj_graph: function(self) {
    return self.adj_graph;
  },

  init_wpt: function(self) {
    var objs = map.map["layers"]["waypoints"]["objects"];
    self.wpoints = {};
    for (var i = 0; i < objs.length; i++) {
      self.wpoints[objs[i].id] = objs[i]["position"];
    }
  },

  init: function(self) {
    self.init_wpt(self);
    self.adj_graph = map.map["layers"]["waypoints"]["adjacency_dct"];
    // add sin/cos precalc here some time in the future
    self.default_velocity = gamescreen.height/20;
    self.train = new Car();
    self.train.init(self.train, self.default_velocity, "steam_locomotive");

  },

  draw: function(self) {
    if (self.cars_added<3) {
      if (self.train.get_distance(self.train) - self.last_distance > 100) {
        self.cars_added ++;
        var car = new Car();
        car.init(car, 0, "red_tank_car");
        car.set_head(car, self.train);
        self.last_distance = self.train.get_distance(self.train);
      }
    }
    self.train.draw(self.train);
    //draw score
    gamescreen.put_text(gamescreen, "bold 20px Arial", "black", "Score: "+self.score, 100, 100);
  }
};

var gamelogic = new GameLogic();
