function GameLogic() {};

GameLogic.prototype = {
  default_velocity: 0,
  car_w: 30,
  car_h: 60,
  const_new_car_timeout: 4,
  const_ticks_in_s: gamescreen.const_fps,
  const_ms_in_s: 1000,

  init: function(self) {
    self.default_velocity = gamescreen.height/30;
  },

  draw: function(self) {

    //draw score
    gamescreen.put_text(gamescreen, "bold 20px Arial", "black", "Score: "+self.score, 100, 100);
  }
};

var gamelogic = new GameLogic();
