(function() {
  window.HeaderView = Backbone.View.extend({
    template: "HeaderView",
    initialize: function() {
      return this.render();
    },
    render: function() {
      var that;
      that = this;
      $.get("/templates/" + this.template + ".html", function(template) {
        return $(that.el).html(template);
      });
      return this;
    },
    selectMenuItem: function() {}
  });

}).call(this);
