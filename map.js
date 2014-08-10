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
