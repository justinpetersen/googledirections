(function() {
  var instance, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.AppModel = (function(_super) {
    __extends(AppModel, _super);

    function AppModel() {
      _ref = AppModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AppModel.prototype.initialize = function() {
      this.googleImages = new Backbone.Collection(this.attributes.googleImages);
      return this.set({
        googleImages: this.googleImages
      });
    };

    AppModel.prototype.addImage = function(image) {
      return this.googleImages.add(image);
    };

    return AppModel;

  })(Backbone.Model);

  return instance = instance || new window.AppModel();

}).call(this);
