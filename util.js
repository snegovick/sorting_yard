var pt_to_pt_dist = function(p1, p2) {
  var x = (p1[0]-p2[0]);
  var y = (p1[1]-p2[1]);
  return Math.sqrt(x*x+y*y);
};

function get_random_int(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
