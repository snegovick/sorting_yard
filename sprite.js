function Sprite() {};

Sprite.prototype = {
  paths: [],
  img_objects: [],
  frame_time: 1,
  current_frame: 0,
  frame_time_counter: 0,

  init: function(self, path) {
    self.this = self;
    self.paths.push(path);
  },

  initMultiPath: function(self, paths, frame_time) {
    self.paths = paths;
    self.animation_speed = frame_time;
    self.loadImages(self);
  },

  loadImages: function(self) {
    for (var i = 0; i < self.paths.length; i++) {
      var img = new Image();
      img.src = self.paths[i];
      self.img_objects.push(img);
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

