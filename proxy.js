function Proxy() {};

Proxy.prototype = {
  position: null,
  name: null,
  sprite: null,
  frame: 0,
  animated: false,
  frame_time: 0,

  frame_time_counter: 0,

  init: function(self, proxy_json) {
    self.name = proxy_json["name"];
    self.position = proxy_json["position"];
    self.frame = proxy_json["frame"];
    self.animated = proxy_json["animated"];
    self.frame_time = proxy_json["frame_time"];
    self.sprite = map.get_sprite_by_name(map, proxy_json["sprite_ref"]);
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

