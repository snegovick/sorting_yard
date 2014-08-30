function Proxy() {};

Proxy.prototype = {
  position: null,
  name: null,
  sprite: null,
  frame: 0,
  animated: false,
  frame_time: 0,

  frame_time_counter: 0,
  current_frame: 0,

  init: function(self, proxy_json) {
    self.name = proxy_json["name"];
    self.position = proxy_json["position"];
    self.frame = proxy_json["frame"];
    self.current_frame = self.frame;
    self.animated = proxy_json["animated"];
    self.frame_time = proxy_json["frame_time"];
    self.sprite = map.get_sprite_by_name(map, proxy_json["sprite_ref"]);
  },

  initFull: function (self, name, position, frame, animated, frame_time, sprite_name) {
    self.name = name;
    self.position = [position[0], position[1]];
    self.frame = frame;
    self.current_frame = self.frame;
    self.animated = animated;
    self.frame_time = frame_time;
    self.sprite = map.get_sprite_by_name(map, sprite_name);    
  },

  set_position: function(self, pos) {
    self.position[0] = pos[0];
    self.position[1] = pos[1];
  },

  get_position: function(self) {
    return [self.position[0], self.position[1]];
  },

  set_frame: function(self, frame) {
    self.current_frame = frame;
  },

  get_dimensions: function(self) {
    return self.sprite.get_dimensions(self.sprite, self.current_frame);
  },

  draw: function(self) {
    if (self.animated) {
      self.frame_time_counter ++;
      if (self.frame_time_counter > self.frame_time) {
        self.frame_time_counter = 0;
        self.current_frame = self.current_frame + 1;
        self.current_frame = self.current_frame % self.sprite.get_n_frames(self.sprite);
      }
    }
    self.sprite.drawFrame(self.sprite, self.current_frame, self.position[0], self.position[1]);
  }
};

