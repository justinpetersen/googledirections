window.App = Backbone.Model.extend({

    defaults: function() {
  
      var defaults = {
          images: []
        };
        
        return defaults;
    },

    initialize: function () {
  
    },

    getImages: function () {
      return this.images;
    }
  
    return instance = (instance or new App());

});