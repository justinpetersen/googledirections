window.ThreeSixtyView = Backbone.View.extend(
  template: "ThreeSixtyView"

  # Tells if the app is ready for user interaction
  ready: false

  # Tells the app if the user is dragging the pointer
  dragging: false

  # Stores the pointer starting X position for the pointer tracking
  pointerStartPosX: 0

  # Stores the pointer ending X position for the pointer tracking
  pointerEndPosX: 0

  # Stores the distance between the starting and ending pointer X position in each time period we are tracking the pointer
  pointerDistance: 0

  # The starting time of the pointer tracking period
  monitorStartTime: 0

  # The pointer tracking time duration
  monitorInt: 10

  # A setInterval instance used to call the rendering function
  ticker: 0

  # Sets the speed of the image sliding animation
  speedMultiplier: 0.00000001

  # CanvasLoader instance variable
  spinner: null

  # Stores the total amount of images we have in the sequence
  totalFrames: 36

  # The current frame value of the image slider animation
  currentFrame: 0

  # The current coordinate values of the frame
  currentCoords: {}

  # Stores all the loaded image objects
  frames: []

  # The value of the end frame which the currentFrame will be tweened to during the sliding animation
  endFrame: 0

  # We keep track of the loaded images by increasing every time a new image is added to the image slider
  loadedImages: 0

  # Stores whether or not the animation is paused
  isPaused: false
  images: []
  events:
    "click .pause": "onPause"
    "click .reposition": "onReposition"

  onReposition: ->
    imageURL = "http://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + @currentCoords.lat + "," + @currentCoords.lng + "&heading=" + $("#degrees").val() + "&sensor=false&key=AIzaSyCyUdEWUkmZFkb1jmDjWi2UmZ345Rvb4sU"
    $(".current-image").attr "src", imageURL

  onPause: ->

    #alert('pause');
    unless @isPaused
      window.clearInterval @ticker
      @ticker = 0
      @isPaused = true
      $(".pause").attr "value", "Resume"
      $(".reposition").show()
    else
      imageURL = "http://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + @currentCoords.lat + "," + @currentCoords.lng + "&heading=" + $("#degrees").val() + "&sensor=false&key=AIzaSyCyUdEWUkmZFkb1jmDjWi2UmZ345Rvb4sU"
      $(".current-image").attr "src", imageURL


  #this.refresh();
  #this.isPaused = false;
  #$('.pause').attr('value','Pause');
  initialize: ->
    @render()

  render: ->
    that = this
    $.get "/templates/" + @template + ".html", (template) ->
      $(that.el).html template
      that.initThreeSixty()

    this

  initThreeSixty: ->
    @initMouseEvents()

    #
    #     We launch the application by...
    #     Adding the preloader, and...
    #
    @addSpinner()

    # loading the firt image in the sequence.
    @loadImage()

  initMouseEvents: ->
    that = this

    ###
    Adds the jQuery "mousedown" event to the image slider wrapper.
    ###
    $("#threesixty").mousedown (event) ->

      # Prevents the original event handler behaciour
      event.preventDefault()

      # Stores the pointer x position as the starting position
      that.pointerStartPosX = that.getPointerEvent(event).pageX

      # Tells the pointer tracking function that the user is actually dragging the pointer and it needs to track the pointer changes
      that.dragging = true


    ###
    Adds the jQuery "mouseup" event to the document. We use the document because we want to let the user to be able to drag
    the mouse outside the image slider as well, providing a much bigger "playground".
    ###
    $(document).mouseup (event) ->

      # Prevents the original event handler behaciour
      event.preventDefault()

      # Tells the pointer tracking function that the user finished dragging the pointer and it doesn't need to track the pointer changes anymore
      that.dragging = false


    ###
    Adds the jQuery "mousemove" event handler to the document. By using the document again we give the user a better user experience
    by providing more playing area for the mouse interaction.
    ###
    $(document).mousemove (event) ->

      # Prevents the original event handler behaciour
      event.preventDefault()

      # Starts tracking the pointer X position changes
      that.trackPointer event


    ###
    ###
    $("#threesixty").live "touchstart", (event) ->

      # Prevents the original event handler behaciour
      event.preventDefault()

      # Stores the pointer x position as the starting position
      that.pointerStartPosX = that.getPointerEvent(event).pageX

      # Tells the pointer tracking function that the user is actually dragging the pointer and it needs to track the pointer changes
      that.dragging = true


    ###
    ###
    $("#threesixty").live "touchmove", (event) ->

      # Prevents the original event handler behaciour
      event.preventDefault()

      # Starts tracking the pointer X position changes
      that.trackPointer event


    ###
    ###
    $("#threesixty").live "touchend", (event) ->

      # Prevents the original event handler behaciour
      event.preventDefault()

      # Tells the pointer tracking function that the user finished dragging the pointer and it doesn't need to track the pointer changes anymore
      @dragging = false


    ###
    Adds the jQuery "click" event to the pause button.
    ###
    $("#pause-button").live "click", (event) ->

      # Prevents the original event handler behaciour
      event.preventDefault()
      alert "pause"



  ###
  Adds a "spiral" shaped CanvasLoader instance to the #spinner div
  ###
  addSpinner: ->
    @spinner = new CanvasLoader("spinner")
    @spinner.setShape "spiral"
    @spinner.setDiameter 90
    @spinner.setDensity 90
    @spinner.setRange 1
    @spinner.setSpeed 4
    @spinner.setColor "#333333"

    # As it's hidden and not rendering by default we have to call its show() method
    @spinner.show()

    # We use the jQuery fadeIn method to slowly fade in the preloader
    $("#spinner").fadeIn "slow"

  setImages: (images) ->
    console.log "ThreeSixtyView.setImages( )"
    @images = images
    i = 0

    while i < images.length
      console.log @images[i]
      i++
    @totalFrames = images.length
    @endFrame = @totalFrames


  ###
  Creates a new <li> and loads the next image in the sequence inside it.
  With jQuery we add the "load" event handler to the image, so when it's successfully loaded, we call the "imageLoaded" function.
  ###
  loadImage: ->
    console.log "ThreeSixtyView.loadImage( )"

    # Creates a new <li>
    li = document.createElement("li")

    # Generates the image file name using the incremented "loadedImages" variable
    #var imageName = "http://maps.googleapis.com/maps/api/streetview?size=400x400&location=37.77180000000001,-122.454270&sensor=false&key=AIzaSyCyUdEWUkmZFkb1jmDjWi2UmZ345Rvb4sU&heading=" + ( this.loadedImages * 10 );
    imageName = @images[@loadedImages]

    #
    #     Creates a new <img> and sets its src attribute to point to the file name we generated.
    #     It also hides the image by applying the "previous-image" CSS class to it.
    #     The image then is added to the <li>.
    #
    image = $("<img>").attr("src", imageName).addClass("previous-image").appendTo(li)

    # We add the newly added image object (returned by jQuery) to the "frames" array.
    @frames.push image

    # We add the <li> to the <ol>
    $("#threesixty_images").append li

    #
    #     Adds the "load" event handler to the new image.
    #     When the event triggers it calls the "imageLoaded" function.
    #
    that = this
    $(image).load ->
      that.imageLoaded()



  ###
  It handles the image "load" events.
  Each time this function is called it checks if all the images have been loaded or it has to load the next one.
  Every time a new image is succesfully loaded, we set the percentage value of the preloader to notify the user about the loading progress.
  If all the images are loaded, it hides the preloader using the jQuery "fadeOut" method, which on complete stops the preloader rendering
  and calls the "showThreesixty" method, that displays the image slider.
  ###
  imageLoaded: ->

    # Increments the value of the "loadedImages" variable
    @loadedImages++

    # Updates the preloader percentage text
    $("#spinner span").text Math.floor(@loadedImages / @totalFrames * 100) + "%"

    # Checks if the currently loaded image is the last one in the sequence...
    if @loadedImages is @totalFrames
      console.log "All images loaded"

      # ...if so, it makes the first image in the sequence to be visible by removing the "previous-image" class and applying the "current-image" on it
      @frames[0].removeClass("previous-image").addClass "current-image"

      #
      #       Displays the image slider by using the jQuery "fadeOut" animation and its complete event handler.
      #       When the preloader is completely faded, it stops the preloader rendering and calls the "showThreesixty" function to display the images.
      #
      that = this
      $("#spinner").fadeOut "slow", ->
        that.spinner.hide()
        that.showThreesixty()

    else

      # ...if not, Loads the next image in the sequence
      @loadImage()


  ###
  Displays the images with the "swooshy" spinning effect.
  As the endFrame is set to -720, the slider will take 4 complete spin before it stops.
  At this point it also sets the application to be ready for the user interaction.
  ###
  showThreesixty: ->

    # Fades in the image slider by using the jQuery "fadeIn" method
    $("#threesixty_images").fadeIn "slow"

    # Sets the "ready" variable to true, so the app now reacts to user interaction
    @ready = true

    # Sets the endFrame to an initial value...
    #this.endFrame = -360;
    # ...so when the animation renders, it will initially take 4 complete spins.
    @refresh()


  ###
  Renders the image slider frame animations.
  ###
  renderFrame: ->
    console.log "ThreeSixtyView.renderFrame( ), currentFrame = " + @currentFrame + ", endFrame = " + @endFrame

    # The rendering function only runs if the "currentFrame" value hasn't reached the "endFrame" one
    if @currentFrame isnt @endFrame

      #
      #       Calculates the 10% of the distance between the "currentFrame" and the "endFrame".
      #       By adding only 10% we get a nice smooth and eased animation.
      #       If the distance is a positive number, we have to ceil the value, if its a negative number, we have to floor it to make sure
      #       that the "currentFrame" value surely reaches the "endFrame" value and the rendering doesn't end up in an infinite loop.
      #

      #var frameEasing = this.endFrame < this.currentFrame ? Math.floor( ( this.endFrame - this.currentFrame ) * 0.1) : Math.ceil( ( this.endFrame - this.currentFrame ) * 0.1);
      frameEasing = 1

      # Sets the current image to be hidden
      @hidePreviousFrame()

      # Increments / decrements the "currentFrame" value by the 10% of the frame distance
      @currentFrame += frameEasing

      # Sets the current image to be visible
      @showCurrentFrame()
    else

      # If the rendering can stop, we stop and clear the ticker
      window.clearInterval @ticker
      @ticker = 0


  ###
  Creates a new setInterval and stores it in the "ticker"
  By default I set the FPS value to 60 which gives a nice and smooth rendering in newer browsers
  and relatively fast machines, but obviously it could be too high for an older architecture.
  ###
  refresh: ->
    console.log "refresh"

    # If the ticker is not running already...
    console.log "ticker: " + @ticker
    if @ticker is 0

      # Let's create a new one!
      @ticker = window.setInterval($.proxy(@renderFrame, this), Math.round(500))
      console.log "set interval"


  ###
  Hides the previous frame
  ###
  hidePreviousFrame: ->

    #
    #     Replaces the "current-image" class with the "previous-image" one on the image.
    #     It calls the "getNormalizedCurrentFrame" method to translate the "currentFrame" value to the "totalFrames" range (1-180 by default).
    #
    @frames[@getNormalizedCurrentFrame()].removeClass("current-image").addClass "previous-image"


  ###
  Displays the current frame
  ###
  showCurrentFrame: ->

    #
    #     Replaces the "current-image" class with the "previous-image" one on the image.
    #     It calls the "getNormalizedCurrentFrame" method to translate the "currentFrame" value to the "totalFrames" range (1-180 by default).
    #
    @frames[@getNormalizedCurrentFrame()].removeClass("previous-image").addClass "current-image"
    imageURL = $(".current-image").attr("src")
    pieces = imageURL.split("location=")
    pieces = pieces[1].split("&heading=")
    coords = pieces[0]

    #alert(coords);
    coordPieces = coords.split(",")
    lat = coordPieces[0]
    lng = coordPieces[1]
    @currentCoords.lat = lat
    @currentCoords.lng = lng
    pieces = pieces[1].split("&sensor=")
    heading = pieces[0]
    $("#current-coordinates").html "Coords: " + lat + "," + lng
    $("#degrees").val heading


  ###
  Returns the "currentFrame" value translated to a value inside the range of 0 and "totalFrames"
  ###
  getNormalizedCurrentFrame: ->
    c = -Math.ceil(@currentFrame % @totalFrames)
    c += (@totalFrames - 1)  if c < 0
    c


  ###
  Returns a simple event regarding the original event is a mouse event or a touch event.
  ###
  getPointerEvent: (event) ->
    (if event.originalEvent.targetTouches then event.originalEvent.targetTouches[0] else event)


  ###
  Tracks the pointer X position changes and calculates the "endFrame" for the image slider frame animation.
  This function only runs if the application is ready and the user really is dragging the pointer; this way we can avoid unnecessary calculations and CPU usage.
  ###
  trackPointer: (event) ->

    # If the app is ready and the user is dragging the pointer...
    if @ready and @dragging

      # Stores the last x position of the pointer
      @pointerEndPosX = @getPointerEvent(event).pageX

      # Checks if there is enough time past between this and the last time period of tracking
      if @monitorStartTime < new Date().getTime() - @monitorInt

        # Calculates the distance between the pointer starting and ending position during the last tracking time period
        @pointerDistance = @pointerEndPosX - @pointerStartPosX

        # Calculates the endFrame using the distance between the pointer X starting and ending positions and the "speedMultiplier" values
        @endFrame = @currentFrame + Math.ceil((@totalFrames - 1) * @speedMultiplier * (@pointerDistance / $("#threesixty").width()))

        # Updates the image slider frame animation
        @refresh()

        # restarts counting the pointer tracking period
        @monitorStartTime = new Date().getTime()

        # Stores the the pointer X position as the starting position (because we started a new tracking period)
        @pointerStartPosX = @getPointerEvent(event).pageX
)
