window.MapRoute = Backbone.Model.extend({

    defaults: function() {
	
		var defaults = {
        	originAddress: "500 Stanyan Street, San Francisco, CA 94117",
			destinationAddress: "118 King Street, San Francisco, CA 94107"
		};
		
		return defaults;
		
    },

    initialize: function () {
	
		if (!this.originAddress) {
			
			this.set("originAddress", this.defaults.originAddress);
			
		}
		
		if (!this.destinationAddress) {

			this.set("destinationAddress", this.defaults.destinationAddress);

		}
		
    }
	
});