function LImage() {};

LImage.prototype = {
  origin: null,
  dimensions: null,
  name: name,

  init: function(self, image_json) {
    self.name = image_json["name"];
    self.origin = image_json["origin"];
    self.dimensions = image_json["dimensions"];
    // console.log("loading image "+self.name);
  },

  get_dimensions: function(self) {
    return self.dimensions;
  },

  draw: function(self, x, y) {
    // console.log("x, y: "+x+", "+y);
    // console.log("origin: "+self.origin);
    // console.log("dimensions: "+self.dimensions);
    gamescreen.ctx.drawImage(map.atlas, 
                             self.origin[0], self.origin[1], 
                             self.dimensions[0], self.dimensions[1], 
                             x, y,
                             self.dimensions[0], self.dimensions[1]);
  }

};

function Sprite() {};

Sprite.prototype = {
  images: [],
  frames: 0,
  name: "",

  init: function(self, sprite_json) {
    self.name = sprite_json["name"];
    image_refs = sprite_json["image_refs"];
    self.frames = image_refs.length;

    self.images = [];
    for (var i = 0; i < self.frames; i++) {
      var image = map.get_image_by_name(map, image_refs[i]);
      if (image === null) {
        console.log("null image: "+image_refs[i]);
      }
      self.images.push(image);
    }
  },

  get_dimensions: function(self, frame) {
    return self.images[frame].get_dimensions(self.images[frame]);
  },

  get_n_frames: function(self) {
    return self.frames;
  },

  drawFrame: function(self, frame, x, y) {
    var image = self.images[frame];
    image.draw(image, x, y);
  },

  draw: function(self, x, y) {
    self.drawFrame(self, self.current_frame, x, y);
  }

};

