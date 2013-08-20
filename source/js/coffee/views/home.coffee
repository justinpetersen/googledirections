window.HomeView = Backbone.View.extend(
  template: "HomeView"
  events:
    change: "onChange"
    "click .getDirections": "onGetDirections"

  map: null
  directionsRenderer: null
  threeSixtyView: null
  onChange: (event) ->
    console.log "HomeView.onChange( )"

    # Apply the change to the model
    target = event.target
    change = {}
    #change[target.name] = target.value
    #@model.set change
    #console.log target.name + ": " + target.value

  onGetDirections: ->
    console.log "HomeView.onGetDirections( )"
    @getDirections @model.get("originAddress"), @model.get("destinationAddress")

  onRoute: (result, status) ->
    console.log "HomeView.onRoute( " + result + ", " + status + ")"
    @renderRoute result

  onFileSystemError: (e) ->
    msg = ""
    switch e.code
      when FileError.QUOTA_EXCEEDED_ERR
        msg = "QUOTA_EXCEEDED_ERR"
      when FileError.NOT_FOUND_ERR
        msg = "NOT_FOUND_ERR"
      when FileError.SECURITY_ERR
        msg = "SECURITY_ERR"
      when FileError.INVALID_MODIFICATION_ERR
        msg = "INVALID_MODIFICATION_ERR"
      when FileError.INVALID_STATE_ERR
        msg = "INVALID_STATE_ERR"
      else
        msg = "Unknown Error"
    console.log "Error: " + msg

  onFileSystemInit: (fs) ->
    fs.root.getFile "images.txt",
      create: true
      exclusive: true
    , ((fileEntry) ->

    # fileEntry.isFile === true
    # fileEntry.name == 'log.txt'
    # fileEntry.fullPath == '/log.txt'
    ), @onFileSystemError
    console.log "Opened file system: " + fs.name

  dataURItoBlob: (dataURI, callback) ->

    # convert base64 to raw binary data held in a string
    # doesn't handle URLEncoded DataURIs
    byteString = atob(dataURI.split(",")[1])

    # separate out the mime component
    mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0]

    # write the bytes of the string to an ArrayBuffer
    ab = new ArrayBuffer(byteString.length)
    ia = new Uint8Array(ab)
    i = 0

    while i < byteString.length
      ia[i] = byteString.charCodeAt(i)
      i++

    # write the ArrayBuffer to a blob, and you're done
    bb = new window.WebKitBlobBuilder() # or just BlobBuilder() if not using Chrome
    bb.append ab
    bb.getBlob mimeString

  getBase64Image: (img) ->

    # Create an empty canvas element
    canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height

    # Copy the image contents to the canvas
    ctx = canvas.getContext("2d")
    ctx.drawImage img, 0, 0

    # Get the data-URL formatted image
    # Firefox supports PNG and JPEG. You could check img.src to
    # guess the original format, but be aware the using "image/jpg"
    # will re-encode the image.
    dataURL = canvas.toDataURL("image/png")
    dataURL.replace /^data:image\/(png|jpg);base64,/, ""

  initialize: ->

    @app = new window.AppModel()

    # var that = this;
    # $.getImageData({
    #   url: "http://farm4.static.flickr.com/3002/2758349058_ab6dc9cfdc_z.jpg",
    #   success: function(image){
    #     //console.log('success');
    #     //alert('success');
    #     image.crossOrigin = "Anonymous";
    #     console.log(image);

    #     var asdf = new Image();
    #     console.log(asdf);
    #window.requestFileSystem = window.requestFileSystem or window.webkitRequestFileSystem
    #window.requestFileSystem window.PERSISTANT, 5 * 1024 * 1024, @onFileSystemInit, @onFileSystemError #5MB

    #     // Set up the canvas
    #     var can = document.getElementsByTagName('canvas')[0];
    #     var ctx = can.getContext('2d');

    #     // Set the canvas width and heigh to the same as the image
    #     $(can).attr('width', image.width);
    #     $(can).attr('height', image.height);

    #     // Draw the image on to the canvas
    #     ctx.drawImage(image, 0, 0, image.width, image.height);

    #     // Get the image data
    #     var image_data = ctx.getImageData(0, 0,  image.width, image.height);

    #     console.log(image_data);

    #     var image_data_array = image_data.data;

    #     // Invert every pixel
    #     for (var i = 0, j = image_data_array.length; i < j; i+=4) {
    #       image_data_array[i] = 255 - image_data_array[i];
    #       image_data_array[i+1] = 255 - image_data_array[i+1];
    #       image_data_array[i+2] = 255 - image_data_array[i+2];
    #     }

    #     // Write the image data to the canvas
    #     ctx.putImageData(image_data, 0, 0);

    #   //   window.requestFileSystem(window.PERSISTENT, 1024*1024, function(fs){
    #    //    fs.root.getFile("image.png", {create:true}, function(fileEntry) {
    #    //        fileEntry.createWriter(function(fileWriter) {
    #    //            fileWriter.write(that.dataURItoBlob(can.toDataURL("image/png")));
    #    //        }, this.onFileSystemError);
    #    //    }, this.onFileSystemError);
    #     // }, this.onFileSystemError);

    #   },
    #   error: function(xhr, text_status){
    #     alert('error');
    #     console.log(xhr);
    #     // Handle your error here
    #   }
    # });

    # function onInitFs(fs) {
    #   console.log('Opened file system: ' + fs.name);
    # }
    # function errorHandler(fs) {
    #   console.log('Error opening file system');
    # }

    #Create image
    # var imageDownload = new Image();
    # imageDownload.src = 'https://sphotos-a.xx.fbcdn.net/hphotos-ash3/1151040_10103324431654235_1355183202_n.jpg';

    #data = this.getBase64Image(imageDownload);
    # /console.log(data);

    #originAddress: "36.059351,-112.143463",
    #   destinationAddress: "36.059282,-112.14287"
    @model.set
      originAddress: "36.057333,-112.143586"
      destinationAddress: "36.065096,-112.137107"

    @render()

  getDirections: (origin, destination) ->
    request =
      origin: origin
      destination: destination
      travelMode: google.maps.TravelMode.WALKING

    directionsService = new google.maps.DirectionsService()
    directionsService.route request, $.proxy(@onRoute, this)

  render: ->
    that = this
    $.get "/templates/" + @template + ".html", (template) ->
      $(that.el).html template
      that.initMap()

    this

  initMap: ->
    mapOptions =
      center: new google.maps.LatLng(-34.397, 150.644)
      zoom: 8
      mapTypeId: google.maps.MapTypeId.ROADMAP

    @map = new google.maps.Map(document.getElementById("map_container"), mapOptions)
    @directionsRenderer = new google.maps.DirectionsRenderer()
    @directionsRenderer.setMap @map
    @directionsRenderer.setPanel document.getElementById("directions_container")

  renderRoute: (result) ->
    @directionsRenderer.setDirections result
    images = []
    image = ""
    steps = result.routes[0].legs[0].steps
    points = []
    i = 0

    while i < steps.length
      points = google.maps.geometry.encoding.decodePath(steps[i].polyline.points)
      j = 0

      while j < points.length

        image = "http://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + points[j].lat() + "," + points[j].lng() + "&heading=75&sensor=false&key=AIzaSyCyUdEWUkmZFkb1jmDjWi2UmZ345Rvb4sU"
        images.unshift image

        #TODO: move to constructor
        googleImage = new window.GoogleImage()
        googleImage.attributes.url = image
        googleImage.attributes.directionalDegrees = 75
        googleImage.attributes.imageId = j
        googleImage.attributes.coords =
          'lat': points[j].lat()
          'lng': points[j].lng()

        # add to image collection
        @app.addImage googleImage


        j++
      i++
    unless @threeSixtyView
      @threeSixtyView = new ThreeSixtyView()
      console.log "@app.attributes.googleImages"
      console.log @app.attributes.googleImages
      @threeSixtyView.setImages @app.attributes.googleImages
    $("#threesixty_container").html @threeSixtyView.el
)
