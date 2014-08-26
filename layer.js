function Layer() {};

Layer.prototype = {
  name: name,
  adjacency_dct: {},
  proxys: []

  init: function(self, layer_json) {
    self.name = layer_json["name"];
    self.adjacency_dct = layer_json["adjacency_dct"];
    var objects = layer_json["objects"];
    for (var i = 0; i < objects.length; i++) {
      var proxy_json = objects[i];
      var proxy = new Proxy();
      proxy.init(proxy, proxy_json);
      self.proxys.push_back(proxy);
    }
  },

  draw: function(self) {
    for (var i = 0; i < self.proxys.length; i++) {
      self.proxys[i].draw();
    }
  }
};

