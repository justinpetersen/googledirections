(function() {
  window.HomeView = Backbone.View.extend({
    template: "HomeView",
    events: {
      change: "onChange",
      "click .getDirections": "onGetDirections"
    },
    map: null,
    directionsRenderer: null,
    threeSixtyView: null,
    onChange: function(event) {
      var change, target;
      console.log("HomeView.onChange( )");
      target = event.target;
      change = {};
      change[target.name] = target.value;
      this.model.set(change);
      return console.log(target.name + ": " + target.value);
    },
    onGetDirections: function() {
      console.log("HomeView.onGetDirections( )");
      return this.getDirections(this.model.get("originAddress"), this.model.get("destinationAddress"));
    },
    onRoute: function(result, status) {
      console.log("HomeView.onRoute( " + result + ", " + status + ")");
      return this.renderRoute(result);
    },
    onFileSystemError: function(e) {
      var msg;
      msg = "";
      switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
          msg = "QUOTA_EXCEEDED_ERR";
          break;
        case FileError.NOT_FOUND_ERR:
          msg = "NOT_FOUND_ERR";
          break;
        case FileError.SECURITY_ERR:
          msg = "SECURITY_ERR";
          break;
        case FileError.INVALID_MODIFICATION_ERR:
          msg = "INVALID_MODIFICATION_ERR";
          break;
        case FileError.INVALID_STATE_ERR:
          msg = "INVALID_STATE_ERR";
          break;
        default:
          msg = "Unknown Error";
      }
      return console.log("Error: " + msg);
    },
    onFileSystemInit: function(fs) {
      fs.root.getFile("images.txt", {
        create: true,
        exclusive: true
      }, (function(fileEntry) {}), this.onFileSystemError);
      return console.log("Opened file system: " + fs.name);
    },
    dataURItoBlob: function(dataURI, callback) {
      var ab, bb, byteString, i, ia, mimeString;
      byteString = atob(dataURI.split(",")[1]);
      mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      ab = new ArrayBuffer(byteString.length);
      ia = new Uint8Array(ab);
      i = 0;
      while (i < byteString.length) {
        ia[i] = byteString.charCodeAt(i);
        i++;
      }
      bb = new window.WebKitBlobBuilder();
      bb.append(ab);
      return bb.getBlob(mimeString);
    },
    getBase64Image: function(img) {
      var canvas, ctx, dataURL;
      canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL("image/png");
      return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    },
    initialize: function() {
      window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
      window.requestFileSystem(window.PERSISTANT, 5 * 1024 * 1024, this.onFileSystemInit, this.onFileSystemError);
      this.model.set({
        originAddress: "36.057333,-112.143586",
        destinationAddress: "36.065096,-112.137107"
      });
      return this.render();
    },
    getDirections: function(origin, destination) {
      var directionsService, request;
      request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.WALKING
      };
      directionsService = new google.maps.DirectionsService();
      return directionsService.route(request, $.proxy(this.onRoute, this));
    },
    render: function() {
      var that;
      that = this;
      $.get("/templates/" + this.template + ".html", function(template) {
        $(that.el).html(template);
        return that.initMap();
      });
      return this;
    },
    initMap: function() {
      var mapOptions;
      mapOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(document.getElementById("map_container"), mapOptions);
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);
      return this.directionsRenderer.setPanel(document.getElementById("directions_container"));
    },
    renderRoute: function(result) {
      var i, image, images, j, points, steps;
      this.directionsRenderer.setDirections(result);
      images = [];
      image = "";
      steps = result.routes[0].legs[0].steps;
      points = [];
      i = 0;
      while (i < steps.length) {
        points = google.maps.geometry.encoding.decodePath(steps[i].polyline.points);
        j = 0;
        while (j < points.length) {
          console.log(points[j].lat() + ", " + points[j].lng());
          image = "http://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + points[j].lat() + "," + points[j].lng() + "&heading=75&sensor=false&key=AIzaSyCyUdEWUkmZFkb1jmDjWi2UmZ345Rvb4sU";
          images.unshift(image);
          j++;
        }
        i++;
      }
      if (!this.threeSixtyView) {
        this.threeSixtyView = new ThreeSixtyView();
        this.threeSixtyView.setImages(images);
      }
      return $("#threesixty_container").html(this.threeSixtyView.el);
    }
  });

}).call(this);
