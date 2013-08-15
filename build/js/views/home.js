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

	onFileSystemError: function(e) {
	  var msg = '';

	  switch (e.code) {
	    case FileError.QUOTA_EXCEEDED_ERR:
	      msg = 'QUOTA_EXCEEDED_ERR';
	      break;
	    case FileError.NOT_FOUND_ERR:
	      msg = 'NOT_FOUND_ERR';
	      break;
	    case FileError.SECURITY_ERR:
	      msg = 'SECURITY_ERR';
	      break;
	    case FileError.INVALID_MODIFICATION_ERR:
	      msg = 'INVALID_MODIFICATION_ERR';
	      break;
	    case FileError.INVALID_STATE_ERR:
	      msg = 'INVALID_STATE_ERR';
	      break;
	    default:
	      msg = 'Unknown Error';
	      break;
	  };

	  console.log('Error: ' + msg);
	},

	onFileSystemInit: function(fs) {
		fs.root.getFile('images.txt', {create: true, exclusive: true}, function(fileEntry) {

    // fileEntry.isFile === true
    // fileEntry.name == 'log.txt'
    // fileEntry.fullPath == '/log.txt'

  	}, this.onFileSystemError);
	  console.log('Opened file system: ' + fs.name);
	},

	dataURItoBlob: function(dataURI, callback) {
    // convert base64 to raw binary data held in a string
	    // doesn't handle URLEncoded DataURIs
	    var byteString = atob(dataURI.split(',')[1]);

	    // separate out the mime component
	    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

	    // write the bytes of the string to an ArrayBuffer
	    var ab = new ArrayBuffer(byteString.length);
	    var ia = new Uint8Array(ab);
	    for (var i = 0; i < byteString.length; i++) {
	        ia[i] = byteString.charCodeAt(i);
	    }

	    // write the ArrayBuffer to a blob, and you're done
	    var bb = new window.WebKitBlobBuilder(); // or just BlobBuilder() if not using Chrome
	    bb.append(ab);
	    return bb.getBlob(mimeString);
	},

	getBase64Image: function(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	},

	initialize: function( ) {





		// var that = this;
		// $.getImageData({
		//   url: "http://farm4.static.flickr.com/3002/2758349058_ab6dc9cfdc_z.jpg",
		//   success: function(image){
		//   	//console.log('success');
		//   	//alert('success');
		//   	image.crossOrigin = "Anonymous";
		//   	console.log(image);

		//   	var asdf = new Image();
		//   	console.log(asdf);


		window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
		window.requestFileSystem(window.PERSISTANT, 5*1024*1024 /*5MB*/, this.onFileSystemInit, this.onFileSystemError);


		//     // Set up the canvas
		//     var can = document.getElementsByTagName('canvas')[0];
		//     var ctx = can.getContext('2d');

		//     // Set the canvas width and heigh to the same as the image
		//     $(can).attr('width', image.width);
		//     $(can).attr('height', image.height);

		//     // Draw the image on to the canvas
		//     ctx.drawImage(image, 0, 0, image.width, image.height);

		//     // Get the image data
		//     var image_data = ctx.getImageData(0, 0,  image.width, image.height);

		//     console.log(image_data);


		//     var image_data_array = image_data.data;

		//     // Invert every pixel
		//     for (var i = 0, j = image_data_array.length; i < j; i+=4) {
		//       image_data_array[i] = 255 - image_data_array[i];
		//       image_data_array[i+1] = 255 - image_data_array[i+1];
		//       image_data_array[i+2] = 255 - image_data_array[i+2];
		//     }

		//     // Write the image data to the canvas
		//     ctx.putImageData(image_data, 0, 0);

		//   //   window.requestFileSystem(window.PERSISTENT, 1024*1024, function(fs){
		// 	 //    fs.root.getFile("image.png", {create:true}, function(fileEntry) {
		// 	 //        fileEntry.createWriter(function(fileWriter) {
		// 	 //            fileWriter.write(that.dataURItoBlob(can.toDataURL("image/png")));
		// 	 //        }, this.onFileSystemError);
		// 	 //    }, this.onFileSystemError);
		// 		// }, this.onFileSystemError);

		//   },
		//   error: function(xhr, text_status){
		//   	alert('error');
		//   	console.log(xhr);
		//     // Handle your error here
		//   }
		// });









		// function onInitFs(fs) {
		//   console.log('Opened file system: ' + fs.name);
		// }
		// function errorHandler(fs) {
		//   console.log('Error opening file system');
		// }

		//Create image
		var imageDownload = new Image();
		imageDownload.src = 'https://sphotos-a.xx.fbcdn.net/hphotos-ash3/1151040_10103324431654235_1355183202_n.jpg';

		//data = this.getBase64Image(imageDownload);
		// /console.log(data);

				//originAddress: "36.059351,-112.143463",
	//		destinationAddress: "36.059282,-112.14287"


		this.model.set( {
			originAddress: "36.057333,-112.143586",
			destinationAddress: "36.065096,-112.137107"
		} );
		this.render( );

	},

	getDirections: function( origin, destination ) {

		var request = {
			origin: origin,
			destination: destination,
			travelMode: google.maps.TravelMode.WALKING
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
				image = "http://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + points[ j ].lat( ) + "," + points[ j ].lng( ) + "&heading=75&sensor=false&key=AIzaSyCyUdEWUkmZFkb1jmDjWi2UmZ345Rvb4sU";
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
