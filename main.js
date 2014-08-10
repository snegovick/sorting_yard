var logic = function() {
  console.log("loaded");

  gamescreen.init(gamescreen);
  map.init(map);
  gamelogic.init(gamelogic);

  gamescreen.set_keydown_cb(gamescreen, function(kc) {
    gamelogic.keydown(gamelogic, kc);
  });

  var drawAll = function() {
    map.draw(map);
    gamelogic.draw(gamelogic);
  };

  window.setInterval(function() {
    gamescreen.draw(gamescreen, drawAll);
  }, gamescreen.frame_timeout);
};

document.addEventListener("DOMContentLoaded", logic, false);
