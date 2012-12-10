window.HeaderView = Backbone.View.extend({

	template: 'HeaderView',
	
	initialize: function() {
		this.render();
	},

	render: function() {
		
		var that = this;
		$.get("/templates/" + this.template + ".html", function(template) {
			$(that.el).html(template);
		});
		
		return this;
		
	},
	
	selectMenuItem: function() {
        /*$('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }*/
	}

});