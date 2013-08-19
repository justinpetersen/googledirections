AppRouter = Backbone.Router.extend(
  routes:
    "": "home"
    map: "map"
    threesixty: "threesixty"
    about: "about"

  initialize: ->
    @headerView = new HeaderView()
    $(".header").html @headerView.el

    @image = new GoogleImage()
    console.log @image

  home: ->
    unless @homeView
      @mapRoute = new MapRoute()
      @homeView = new HomeView(model: @mapRoute)
    $("#content").html @homeView.el
    @headerView.selectMenuItem "home-menu"

  map: ->
    @mapView = new MapView()  unless @mapView
    $("#content").html @mapView.el
    @headerView.selectMenuItem "map-menu"

  threesixty: ->
    @threeSixtyView = new ThreeSixtyView()  unless @threeSixtyView
    $("#content").html @threeSixtyView.el
    @headerView.selectMenuItem "threesixty-menu"

  about: ->
    @aboutView = new AboutView()  unless @aboutView
    $("#content").html @aboutView.el
    @headerView.selectMenuItem "about-menu"
)
app = new AppRouter()
Backbone.history.start()
