function Layer() {};

Layer.prototype = {
  name: name,
  adjacency_dct: {},
  proxys: []

  init: function(self, id, map_json) {
    var layer_json = map_json["layers"][id];
    self.name = map_json["layers"][id]["name"];
    self.adjacency_dct = layer_json["adjacency_dct"];
    
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

