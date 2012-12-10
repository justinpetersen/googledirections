window.AboutView = Backbone.View.extend({

	template: 'AboutView',
	
	initialize: function() {
		this.render();
	},

	render: function() {
		var that = this;
		$.get("/templates/" + this.template + ".html", function(template) {
			$(that.el).html(template);
		});
		return this;
	}

});