window.HomeView = Backbone.View.extend({

	template: 'HomeView',
	
	events: {
		"change": "onChange",
		"click .getDirections": "onGetDirections"
	},
	
	map: null,
	directionsRenderer: null,
	threeSixtyView: null,
	
	onChange: function( event ) {
		
		console.log( "HomeView.onChange( )" );
		
        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[ target.name ] = target.value;
        this.model.set(change);
		
		console.log( target.name + ": " + target.value );
		
	},
	
	onGetDirections: function( ) {
		
		console.log( "HomeView.onGetDirections( )" );
		
		this.getDirections( this.model.get("originAddress"), this.model.get("destinationAddress") );
		
	},
	
	onRoute: function( result, status ) {
		
		console.log( "HomeView.onRoute( " + result + ", " + status + ")" );
		
		this.renderRoute( result );
		
	},
	
	initialize: function( ) {
		
		this.model.set( {
			originAddress: "500 Stanyan St, San Francisco",
			destinationAddress: "118 King St, San Francisco"
		} );
		this.render( );
		
	},
	
	getDirections: function( origin, destination ) {
		
		var request = {
			origin: origin,
			destination: destination,
			travelMode: google.maps.TravelMode.DRIVING
		};
		var directionsService = new google.maps.DirectionsService( );
		directionsService.route( request, $.proxy( this.onRoute, this ) );
		
	},

	render: function( ) {
		
		var that = this;
		$.get( "/templates/" + this.template + ".html", function( template ) {
			$( that.el ).html( template );
			that.initMap();
		});
		
		return this;
		
	},
	
	initMap: function( ) {
		
		var mapOptions = {
			center: new google.maps.LatLng(-34.397, 150.644),
			zoom: 8,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		this.map = new google.maps.Map( document.getElementById('map_container'), mapOptions );

		this.directionsRenderer = new google.maps.DirectionsRenderer( );
		this.directionsRenderer.setMap( this.map );
		this.directionsRenderer.setPanel( document.getElementById('directions_container') );
		
	},
	
	renderRoute: function( result ) {
		
		this.directionsRenderer.setDirections( result );
		
		var images = [];
		var image = "";
		var steps = result.routes[0].legs[0].steps;
		var points = [];
		for ( var i = 0; i < steps.length; i++ ) {
			
			points = google.maps.geometry.encoding.decodePath( steps[ i ].polyline.points );
			
			for ( var j = 0; j < points.length; j++ ) {
				
				console.log( points[ j ].lat( ) + ", " + points[ j ].lng( ) );
				image = "http://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + points[ j ].lat( ) + "," + points[ j ].lng( ) + "&sensor=false&key=AIzaSyCyUdEWUkmZFkb1jmDjWi2UmZ345Rvb4sU&heading=0";
				images.unshift( image );
				
			}
			
		}
		
		if (!this.threeSixtyView) {
			this.threeSixtyView = new ThreeSixtyView();
			this.threeSixtyView.setImages( images );
		}
		$('#threesixty_container').html(this.threeSixtyView.el);
		
	}

});