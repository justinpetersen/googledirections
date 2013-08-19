(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.GoogleImages = (function(_super) {
    __extends(GoogleImages, _super);

    function GoogleImages() {
      _ref = GoogleImages.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    GoogleImages.prototype.model = GoogleImages;

    GoogleImages.prototype.initialize = function() {
      return this.logger = Logger.get('Images');
    };

    GoogleImages.prototype.addImage = function(image) {
      return this.add(image);
    };

    return GoogleImages;

  })(Backbone.Collection);

}).call(this);
