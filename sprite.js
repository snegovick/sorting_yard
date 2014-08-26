function LImage() {};

LImage.prototype = {
  origin: null,
  dimensions: null,
  name: name,
  image: null,

  init: function(self, image_json) {
    self.name = image_json["name"];
    self.origin = image_json["origin"];
    self.dimensions = image_json["dimensions"];
    console.log("loading image "+self.name);
  },

  draw: function(self, x, y) {
    gamescreen.ctx.drawImage(self.image, 
                             self.origin[0], self.origin[1], 
                             self.dimensions[0], self.dimensions[1], 
                             x-self.image.width/2, y-self.image.height/2,
                             self.dimensions[0], self.dimensions[1]);
  }

};

function Sprite() {};

Sprite.prototype = {
  images: null,
  frames: 0,
  name: name,

  init: function(self, sprite_json) {
    self.name = sprite_json["name"];
    image_refs = sprite_json["image_refs"];
    self.frames = image_refs.length;

    self.images = [];
    for (var i = 0; i < self.frames; i++) {
      var image = map.get_image_by_name(map, name);
      self.images.push(image);
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

