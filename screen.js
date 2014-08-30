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
    var min_dim = Math.min(window.innerWidth, window.innerHeight);
    console.log("min_dim:", min_dim);
    self.canvas.width = min_dim;
    self.canvas.height = min_dim;
    self.width = self.canvas.width;
    self.height = self.canvas.height;
    self.ctx = self.canvas.getContext("2d");
  },

  set_keydown_cb: function(self, cb) {
    window.addEventListener('keydown', cb, true);
  },

  get_text_w: function(self, cw, text) {
    return cw*text.length;
  },

  put_text: function(self, font, style, text, px, py) {
    var old_color = self.ctx.fillStyle;
    self.ctx.fillStyle = style;
    var old_font = self.ctx.font;
    self.ctx.font = font;
    self.ctx.fillText(text, px, py);
    self.ctx.fillStyle = old_color;
    self.ctx.font = old_font;
  },

  put_line: function(self, style, sx, sy, ex, ey, width) {
    width = width || 5;
    var old_color = self.ctx.fillStyle;
    var old_width = self.ctx.lineWidth;
    self.ctx.strokeStyle = style;
    self.ctx.lineWidth = width;
    self.ctx.beginPath();
    self.ctx.moveTo(sx, sy);
    self.ctx.lineTo(ex, ey);
    self.ctx.stroke();
    self.ctx.strokeStyle = old_color;
    self.ctx.lineWidth = old_width;
  },

  put_rect: function(self, style, orientation, x, y, w, h) {
    self.ctx.translate(x, y);
    if (orientation != 0) {
      self.ctx.rotate(orientation);
    }
    var old_color = self.ctx.fillStyle;
    self.ctx.fillStyle = style;
    self.ctx.fillRect(-w/2, -h/2, w, h);
    self.ctx.fillStyle = old_color;
    if (orientation != 0) {
      self.ctx.rotate(-orientation);
    }
    self.ctx.translate(-x, -y);
  },

  draw: function(self, callback) {
    self.ctx.clearRect(0, 0, self.width, self.height);
    callback();
  }
};

var gamescreen = new GameScreen();
