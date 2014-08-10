function GameScreen() {};

GameScreen.prototype = {
  canvas: null,
  width: 0,
  height: 0,
  ctx: null,
  const_fps: 30,
  frame_timeout: 0,


  init: function(self) {
    self.frame_timeout = 1000/self.const_fps;
    self.canvas = document.getElementById("canvas");
    self.canvas.width = window.innerWidth;
    self.canvas.height = window.innerHeight;
    self.width = self.canvas.width;
    self.height = self.canvas.height;
    self.ctx = self.canvas.getContext("2d");
  },

  set_keydown_cb: function(self, cb) {
    window.addEventListener('keydown', cb, true);
  },

  draw: function(self, callback) {
    self.ctx.clearRect(0, 0, self.width, self.height);
    callback();
  }
};

var gamescreen = new GameScreen();
