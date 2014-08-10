var logic = function() {
  console.log("loaded");
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var width = canvas.width;
  var height = canvas.height;
  var ctx = canvas.getContext("2d");

  var fps = 30;
  var MS_IN_S = 1000;
  var timeout = MS_IN_S/fps;

  var second_ctr = 0;
  var TICKS_IN_S = fps;
  var new_car_ctr = 0;
  var NEW_CAR_TIMEOUT = 2;

  var default_velocity = height/10;
  var car_w = 30;
  var car_h = 60;


  var map = {
    "rail_points": {
      0: [0.5, 0.1],
      1: [0.5, 0.3],
      2: [0.5, 0.4],
      3: [0.5, 0.9],
      
      4: [0.2, 0.6],
      5: [0.2, 0.9],
      
      6: [0.7, 0.6],
      7: [0.7, 0.9]
    },

    "rail_graph_adj_list": {
      0: [1],
      1: [2, 4],
      2: [3, 6],
      3: [],
      4: [5],
      5: [],
      6: [7],
      7: []
    }
  };

  var cars = [];
  var stopped_cars = {};
  var switches = {};

  var __deferred_remove_cars = [];

  var init_switches = function() {
    for (var i = 0; i < map["rail_graph_adj_list"].length; i++) {
      var p = map["rail_graph_adj_list"];
      if (p.length > 1) {
        switches[i] = {"state": 0};
      }
    }
  };

  init_switches();

  var mk_car = function() {
    var sx = map["rail_points"][0][0]*width;
    var sy = map["rail_points"][0][1]*height;

    var ex = map["rail_points"][1][0]*width;
    var ey = map["rail_points"][1][1]*height;

    var orientation = Math.atan2(ey-sy, ex-sx) - Math.PI/2;
    console.log("adding car at "+ sx+ " "+ sy);
    cars.push({"position": [sx, sy], "orientation": orientation, "heading_sin": Math.sin(orientation), "heading_cos": Math.cos(orientation), "velocity": default_velocity, "color": "blue", "destination_pt": 1});
  };

  var pt_to_pt_dist = function(p1, p2) {
    var x = (p1[0]-p2[0]);
    var y = (p1[1]-p2[1]);
    return Math.sqrt(x*x+y*y);
  };

  var move_car_to_stopped = function(cid, dest_pt_id) {
    if (dest_pt_id in stopped_cars) {
      stopped_cars[dest_pt_id].push(cars[cid]);
    } else {
      stopped_cars[dest_pt_id] = [cars[cid]];
    }
    cars.splice(cid, 1);
  };

  var checkStoppedCars = function(cid, dest_pt_id, current_pt_id) {
    var car_pos = cars[cid]["position"];
    if (dest_pt_id in stopped_cars) {
      for (var i = 0; i < stopped_cars[dest_pt_id].length; i++) {
        var oc = stopped_cars[dest_pt_id][i];
        var oc_pos = oc["position"];
        if (pt_to_pt_dist(oc_pos, car_pos) < car_h*1.5) {
          move_car_to_stopped(cid, current_pt_id);
          return true;
        }
      }
    }
    return false;
  };

  var advanceCar = function(cid) {
    var ds = cars[cid]["velocity"]*fps/MS_IN_S;
    cars[cid]["position"][0] += cars[cid]["heading_sin"]*ds;
    cars[cid]["position"][1] += cars[cid]["heading_cos"]*ds;
    var car_pos = cars[cid]["position"];
    var dest_pt_id = cars[cid]["destination_pt"];
    var dest_pt = [map["rail_points"][dest_pt_id][0]*width, map["rail_points"][dest_pt_id][1]*height];
    var dist = pt_to_pt_dist(car_pos, dest_pt);
    
    //check stopped cars in current dest and adjacent pts
    //console.log("checking:"+dest_pt_id);
    if (checkStoppedCars(cid, dest_pt_id, dest_pt_id)) {
      return false;
    }
    
    for (var i = 0; i < map["rail_graph_adj_list"][dest_pt_id].length; i++) {
      //console.log("checking: "+map["rail_graph_adj_list"][dest_pt_id][i]);
      if (checkStoppedCars(cid, map["rail_graph_adj_list"][dest_pt_id][i], dest_pt_id)) {
        return false;
      }
    }

    if (pt_to_pt_dist(car_pos, dest_pt) <= 2) {
      if (dest_pt_id in switches) {
        cars[cid]["destination_pt"] = map["rail_graph_adj_list"][dest_pt_id][switches[dest_pt_id][state]];
      } else {
        if (map["rail_graph_adj_list"][dest_pt_id].length == 0) {
          cars[cid]["velocity"] = 0;
          move_car_to_stopped(cid, dest_pt_id);
          return false;
        } else {
          cars[cid]["destination_pt"] = map["rail_graph_adj_list"][dest_pt_id][0];
        }
      }
      console.log("new destination pt for car["+cid+"] : "+cars[cid]["destination_pt"]);
    }
    return true;
  };

  var displayCar = function(cid) {

    var angle = cars[cid]["orientation"];
    var cx = cars[cid]["position"][0];
    var cy = cars[cid]["position"][1];
    var vel = cars[cid]["velocity"];
    var color = cars[cid]["color"];

    ctx.translate(cx, cy);
    ctx.rotate(angle);
    var old_color = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.fillRect(-car_w/2, -car_h/2, car_w, car_h);
    ctx.fillStyle = old_color;
    ctx.rotate(-angle);
    ctx.translate(-cx, -cy);
  };

  var displayStoppedCar = function(car) {
    var angle = car["orientation"];
    var cx = car["position"][0];
    var cy = car["position"][1];
    var vel = car["velocity"];
    var color = car["color"];

    ctx.translate(cx, cy);
    ctx.rotate(angle);
    var old_color = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.fillRect(-car_w/2, -car_h/2, car_w, car_h);
    ctx.fillStyle = old_color;
    ctx.rotate(-angle);
    ctx.translate(-cx, -cy);
  };

  var displayNode = function(n) {
    //console.log("drawing "+n);
    var pt_width = 5;
    var cx = map["rail_points"][n][0]*width;
    var cy = map["rail_points"][n][1]*height;
    ctx.fillRect(cx-pt_width/2, cy-pt_width/2, pt_width, pt_width);
    if (map["rail_graph_adj_list"][n].length > 0) {
      for (var i = 0; i < map["rail_graph_adj_list"][n].length; i++) {
        p = map["rail_graph_adj_list"][n][i];
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        var ox = map["rail_points"][p][0]*width;
        var oy = map["rail_points"][p][1]*height;
        ctx.lineTo(ox, oy);
        ctx.stroke();
        displayNode(p);
      }
    }
  };

  var displayMap = function() {
    ctx.clearRect(0, 0, width, height);
    //console.log("Drawing map");
    displayNode(0);
    second_ctr ++;
    if (second_ctr > TICKS_IN_S) {
      second_ctr = 0;
      new_car_ctr ++;
      if (new_car_ctr > NEW_CAR_TIMEOUT) {
        new_car_ctr = 0;
        mk_car();
      }
    }

    for (var i = 0; i < cars.length; i++) {
      displayCar(i);
      if (!advanceCar(i)) {
        i-=1;
      }
    }

    for (var k in stopped_cars) {
      for (var i = 0; i < stopped_cars[k].length; i++) {
        var car = stopped_cars[k][i];
        displayStoppedCar(car);
      }
    }
  };

  window.setInterval(displayMap, timeout);
};

document.addEventListener("DOMContentLoaded", logic, false);
