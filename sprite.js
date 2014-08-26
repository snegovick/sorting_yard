function LImage() {};

Image.prototype = {
  origin: null,
  dimensions: null,
  name: name,
  image: null,

  init: function(self, image_json) {
    self.name = sprite_json["name"];
    self.origin = image_json["origin"];
    dimensions = image_json["dimensions"];
  },

  draw: function(self, x, y) {
    gamescreen.ctx.drawImage(self.image, x-self.image.width/2, y-self.image.height/2);
  }

};

function Sprite() {};

Sprite.prototype = {
  images: [],
  frames: 0,
  name: name,

  init: function(self, sprite_json) {
    self.name = sprite_json["name"];
    image_refs = sprite_json["image_refs"];
    self.frames = image_refs.length;
    for (var i = 0; i < self.frames; i++) {
      var image = map.get_image_by_name(map, name);
      self.images.push_back(image);
    }
  },

  drawFrame: function(self, frame, x, y) {
    var image = self.images[frame];
    image.draw(x, y);
  },

  draw: function(self, x, y) {
    self.frame_time_counter ++;
    if (self.frame_time_counter > self.frame_time) {
      self.frame_time_counter = 0;
      self.current_frame = self.current_frame + 1;
      self.current_frame = self.current_frame % self.img_objects.length;
    }
    self.drawFrame(self, self.current_frame, x, y);
  }

};

