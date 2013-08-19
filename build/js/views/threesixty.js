(function() {
  window.ThreeSixtyView = Backbone.View.extend({
    template: "ThreeSixtyView",
    ready: false,
    dragging: false,
    pointerStartPosX: 0,
    pointerEndPosX: 0,
    pointerDistance: 0,
    monitorStartTime: 0,
    monitorInt: 10,
    ticker: 0,
    speedMultiplier: 0.00000001,
    spinner: null,
    totalFrames: 36,
    currentFrame: 0,
    currentCoords: {},
    frames: [],
    endFrame: 0,
    loadedImages: 0,
    isPaused: false,
    images: [],
    events: {
      "click .pause": "onPause",
      "click .reposition": "onReposition"
    },
    onReposition: function() {
      var imageURL;
      imageURL = "http://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + this.currentCoords.lat + "," + this.currentCoords.lng + "&heading=" + $("#degrees").val() + "&sensor=false&key=AIzaSyCyUdEWUkmZFkb1jmDjWi2UmZ345Rvb4sU";
      return $(".current-image").attr("src", imageURL);
    },
    onPause: function() {
      var imageURL;
      if (!this.isPaused) {
        window.clearInterval(this.ticker);
        this.ticker = 0;
        this.isPaused = true;
        $(".pause").attr("value", "Resume");
        return $(".reposition").show();
      } else {
        imageURL = "http://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + this.currentCoords.lat + "," + this.currentCoords.lng + "&heading=" + $("#degrees").val() + "&sensor=false&key=AIzaSyCyUdEWUkmZFkb1jmDjWi2UmZ345Rvb4sU";
        return $(".current-image").attr("src", imageURL);
      }
    },
    initialize: function() {
      return this.render();
    },
    render: function() {
      var that;
      that = this;
      $.get("/templates/" + this.template + ".html", function(template) {
        $(that.el).html(template);
        return that.initThreeSixty();
      });
      return this;
    },
    initThreeSixty: function() {
      this.initMouseEvents();
      this.addSpinner();
      return this.loadImage();
    },
    initMouseEvents: function() {
      var that;
      that = this;
      /*
      Adds the jQuery "mousedown" event to the image slider wrapper.
      */

      $("#threesixty").mousedown(function(event) {
        event.preventDefault();
        that.pointerStartPosX = that.getPointerEvent(event).pageX;
        return that.dragging = true;
      });
      /*
      Adds the jQuery "mouseup" event to the document. We use the document because we want to let the user to be able to drag
      the mouse outside the image slider as well, providing a much bigger "playground".
      */

      $(document).mouseup(function(event) {
        event.preventDefault();
        return that.dragging = false;
      });
      /*
      Adds the jQuery "mousemove" event handler to the document. By using the document again we give the user a better user experience
      by providing more playing area for the mouse interaction.
      */

      $(document).mousemove(function(event) {
        event.preventDefault();
        return that.trackPointer(event);
      });
      /*
      */

      $("#threesixty").live("touchstart", function(event) {
        event.preventDefault();
        that.pointerStartPosX = that.getPointerEvent(event).pageX;
        return that.dragging = true;
      });
      /*
      */

      $("#threesixty").live("touchmove", function(event) {
        event.preventDefault();
        return that.trackPointer(event);
      });
      /*
      */

      $("#threesixty").live("touchend", function(event) {
        event.preventDefault();
        return this.dragging = false;
      });
      /*
      Adds the jQuery "click" event to the pause button.
      */

      return $("#pause-button").live("click", function(event) {
        event.preventDefault();
        return alert("pause");
      });
    },
    /*
    Adds a "spiral" shaped CanvasLoader instance to the #spinner div
    */

    addSpinner: function() {
      this.spinner = new CanvasLoader("spinner");
      this.spinner.setShape("spiral");
      this.spinner.setDiameter(90);
      this.spinner.setDensity(90);
      this.spinner.setRange(1);
      this.spinner.setSpeed(4);
      this.spinner.setColor("#333333");
      this.spinner.show();
      return $("#spinner").fadeIn("slow");
    },
    setImages: function(images) {
      var i;
      console.log("ThreeSixtyView.setImages( )");
      this.images = images;
      i = 0;
      while (i < images.length) {
        console.log(this.images[i]);
        i++;
      }
      this.totalFrames = images.length;
      return this.endFrame = this.totalFrames;
    },
    /*
    Creates a new <li> and loads the next image in the sequence inside it.
    With jQuery we add the "load" event handler to the image, so when it's successfully loaded, we call the "imageLoaded" function.
    */

    loadImage: function() {
      var image, imageName, li, that;
      console.log("ThreeSixtyView.loadImage( )");
      li = document.createElement("li");
      imageName = this.images[this.loadedImages];
      image = $("<img>").attr("src", imageName).addClass("previous-image").appendTo(li);
      this.frames.push(image);
      $("#threesixty_images").append(li);
      that = this;
      return $(image).load(function() {
        return that.imageLoaded();
      });
    },
    /*
    It handles the image "load" events.
    Each time this function is called it checks if all the images have been loaded or it has to load the next one.
    Every time a new image is succesfully loaded, we set the percentage value of the preloader to notify the user about the loading progress.
    If all the images are loaded, it hides the preloader using the jQuery "fadeOut" method, which on complete stops the preloader rendering
    and calls the "showThreesixty" method, that displays the image slider.
    */

    imageLoaded: function() {
      var that;
      this.loadedImages++;
      $("#spinner span").text(Math.floor(this.loadedImages / this.totalFrames * 100) + "%");
      if (this.loadedImages === this.totalFrames) {
        console.log("All images loaded");
        this.frames[0].removeClass("previous-image").addClass("current-image");
        that = this;
        return $("#spinner").fadeOut("slow", function() {
          that.spinner.hide();
          return that.showThreesixty();
        });
      } else {
        return this.loadImage();
      }
    },
    /*
    Displays the images with the "swooshy" spinning effect.
    As the endFrame is set to -720, the slider will take 4 complete spin before it stops.
    At this point it also sets the application to be ready for the user interaction.
    */

    showThreesixty: function() {
      $("#threesixty_images").fadeIn("slow");
      this.ready = true;
      return this.refresh();
    },
    /*
    Renders the image slider frame animations.
    */

    renderFrame: function() {
      var frameEasing;
      console.log("ThreeSixtyView.renderFrame( ), currentFrame = " + this.currentFrame + ", endFrame = " + this.endFrame);
      if (this.currentFrame !== this.endFrame) {
        frameEasing = 1;
        this.hidePreviousFrame();
        this.currentFrame += frameEasing;
        return this.showCurrentFrame();
      } else {
        window.clearInterval(this.ticker);
        return this.ticker = 0;
      }
    },
    /*
    Creates a new setInterval and stores it in the "ticker"
    By default I set the FPS value to 60 which gives a nice and smooth rendering in newer browsers
    and relatively fast machines, but obviously it could be too high for an older architecture.
    */

    refresh: function() {
      console.log("refresh");
      console.log("ticker: " + this.ticker);
      if (this.ticker === 0) {
        this.ticker = window.setInterval($.proxy(this.renderFrame, this), Math.round(500));
        return console.log("set interval");
      }
    },
    /*
    Hides the previous frame
    */

    hidePreviousFrame: function() {
      return this.frames[this.getNormalizedCurrentFrame()].removeClass("current-image").addClass("previous-image");
    },
    /*
    Displays the current frame
    */

    showCurrentFrame: function() {
      var coordPieces, coords, heading, imageURL, lat, lng, pieces;
      this.frames[this.getNormalizedCurrentFrame()].removeClass("previous-image").addClass("current-image");
      imageURL = $(".current-image").attr("src");
      pieces = imageURL.split("location=");
      pieces = pieces[1].split("&heading=");
      coords = pieces[0];
      coordPieces = coords.split(",");
      lat = coordPieces[0];
      lng = coordPieces[1];
      this.currentCoords.lat = lat;
      this.currentCoords.lng = lng;
      pieces = pieces[1].split("&sensor=");
      heading = pieces[0];
      $("#current-coordinates").html("Coords: " + lat + "," + lng);
      return $("#degrees").val(heading);
    },
    /*
    Returns the "currentFrame" value translated to a value inside the range of 0 and "totalFrames"
    */

    getNormalizedCurrentFrame: function() {
      var c;
      c = -Math.ceil(this.currentFrame % this.totalFrames);
      if (c < 0) {
        c += this.totalFrames - 1;
      }
      return c;
    },
    /*
    Returns a simple event regarding the original event is a mouse event or a touch event.
    */

    getPointerEvent: function(event) {
      if (event.originalEvent.targetTouches) {
        return event.originalEvent.targetTouches[0];
      } else {
        return event;
      }
    },
    /*
    Tracks the pointer X position changes and calculates the "endFrame" for the image slider frame animation.
    This function only runs if the application is ready and the user really is dragging the pointer; this way we can avoid unnecessary calculations and CPU usage.
    */

    trackPointer: function(event) {
      if (this.ready && this.dragging) {
        this.pointerEndPosX = this.getPointerEvent(event).pageX;
        if (this.monitorStartTime < new Date().getTime() - this.monitorInt) {
          this.pointerDistance = this.pointerEndPosX - this.pointerStartPosX;
          this.endFrame = this.currentFrame + Math.ceil((this.totalFrames - 1) * this.speedMultiplier * (this.pointerDistance / $("#threesixty").width()));
          this.refresh();
          this.monitorStartTime = new Date().getTime();
          return this.pointerStartPosX = this.getPointerEvent(event).pageX;
        }
      }
    }
  });

}).call(this);
