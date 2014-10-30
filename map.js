function Map() {};

Map.prototype = {
  map: null,
  atlas: null,
  images: {},
  sprites: {},
  layers: {},

  get_image_by_name: function(self, name) {
    if (name in self.images) {
      return self.images[name];
    }
    return null;
  },

  get_sprite_by_name: function(self, name) {
    if (name in self.sprites) {
      return self.sprites[name];
    }
    return null;
  },

  init: function(self) {
    self.map = map_data;
    self.atlas = new Image();
    self.atlas.onLoad=function() {
      console.log("atlas loaded");
    };
    self.atlas.src = self.map["atlas_path"];

    for (var i in self.map["images"]) {
      var image_json = self.map["images"][i];
      var image = new LImage();
      image.init(image, image_json);
      self.images[image.name] = image;
    }

    for (var s in self.map["sprites"]) {
      var sprite_json = self.map["sprites"][s];
      var sprite = new Sprite();
      sprite.init(sprite, sprite_json);
      self.sprites[sprite.name] = sprite;
    }

    var layer_json = self.map["layers"]["main"];
    var layer = new Layer();
    layer.init(layer, layer_json);
    self.layers[layer.name] = layer;
  },

  draw: function(self) {
    var layer = self.layers["main"];
    layer.draw(layer);
  }
};

var map = new Map();
