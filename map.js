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
