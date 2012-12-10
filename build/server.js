//-----------------------------------------------------------------------------------------------
// initialization
//-----------------------------------------------------------------------------------------------

var application = new GoogleDirectionsApplication( );
application.init( );

function GoogleDirectionsApplication( ) {
	
	//-----------------------------------------------------------------------------------------------
	// public static constants
	//-----------------------------------------------------------------------------------------------
	
	// directories to route
	this.ROUTE_DIRECTORIES = [ 'css', 'img', 'js', 'js/models', 'js/views', 'lib', 'templates' ];
	
	// file name of index page
	this.INDEX_FILE_NAME = 'index.html';
	
	//-----------------------------------------------------------------------------------------------
	// jQuery scope
	//-----------------------------------------------------------------------------------------------

	var $ = null;
	
	//-----------------------------------------------------------------------------------------------
	// private properties
	//-----------------------------------------------------------------------------------------------
	
	this._model = null;
	this._express = null;
	this._app = null;
	
	//-----------------------------------------------------------------------------------------------
	// public methods
	//-----------------------------------------------------------------------------------------------
	
	this.init = function( ) {
		
		// set jQuery scope
		$ = require('jquery');
		
		this.initServer( );
		
	};

	//-----------------------------------------------------------------------------------------------
	// private callback handlers
	//-----------------------------------------------------------------------------------------------

	this.onServerHandler = function( directory, file, req, res ) {
		
		console.log( 'GoogleDirectionsApplication.onServerHandler( )' );
		
		var path = __dirname + '/' + directory + '/' + file;
		console.log( 'path: ' + path );

		var fs = require('fs');
		fs.readFile( path,
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}
			res.writeHead(200);
			res.end(data);
		});

	};

	//-----------------------------------------------------------------------------------------------
	// private methods
	//-----------------------------------------------------------------------------------------------
	
	this.initServer = function( ) {
		
		this._app = require( 'express' ).createServer( );
		this._app.listen( process.env.PORT || 8001 );

		this.initRoutes( );
		
	};
	
	this.initRoutes = function( ) {
		
		// route to index.html
		this._app.get( '/', $.proxy( this.onServerHandler, this, '.', this.INDEX_FILE_NAME ) );
		
		var fs = require( 'fs' );
		// automatically set up routes to all CSS and JS files
		for ( var i = 0; i < this.ROUTE_DIRECTORIES.length; i++ ) {
			// for each file in the asset directories
			fs.readdirSync( __dirname + '/' + this.ROUTE_DIRECTORIES[ i ] ).forEach( $.proxy( this.routeFile, this, [ this.ROUTE_DIRECTORIES[ i ] ] ) );
		}
		
	};
	
	this.routeFile = function( directory, file ) {
		
		console.log( 'GoogleDirectionsApplication.routeFile( ' + directory + ', ' + file + ' )' );
		
		var route = '/' + directory + '/' + file;
		this._app.get( route, $.proxy( this.onServerHandler, this, directory, file ) );
		
	}
	
}