(function() {
  window.AboutView = Backbone.View.extend({
    template: "AboutView",
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
    }
  });

}).call(this);
