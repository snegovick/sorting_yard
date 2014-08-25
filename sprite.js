function Sprite() {};

Sprite.prototype = {
  origins: [],
  dimensions: [],
  frames: 0,
  name: name,

  init: function(self, name, map_json) {
    self.this = self;
    var sprite_json = map_json["sprites"][name];
    self.name = name;
    image_refs = sprite_json["image_refs"];
    frames = image_refs.length;
    for (var i = 0; i < frames; i++) {
      origin = map_json["images"][image_refs[i]]["origin"];
      self.origins.push_back(origin);
      dimensions = map_json["images"][image_refs[i]]["dimensions"];
      self.dimensions.push_back(dimensions);
    }
  },

  drawFrame: function(self, frame, x, y) {
    var img = self.img_objects[frame];
    gamescreen.ctx.drawImage(img, x-img.width/2, y-img.height/2);
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

