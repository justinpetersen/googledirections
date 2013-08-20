(function() {
  var AppRouter, app;

  AppRouter = Backbone.Router.extend({
    routes: {
      "": "home",
      map: "map",
      threesixty: "threesixty",
      about: "about"
    },
    initialize: function() {
      this.headerView = new HeaderView();
      $(".header").html(this.headerView.el);
      this.image = new GoogleImage();
      return console.log(this.image);
    },
    home: function() {
      if (!this.homeView) {
        this.mapRoute = new MapRoute();
        this.homeView = new HomeView({
          model: this.mapRoute
        });
      }
      $("#content").html(this.homeView.el);
      return this.headerView.selectMenuItem("home-menu");
    },
    map: function() {
      if (!this.mapView) {
        this.mapView = new MapView();
      }
      $("#content").html(this.mapView.el);
      return this.headerView.selectMenuItem("map-menu");
    },
    threesixty: function() {
      if (!this.threeSixtyView) {
        this.threeSixtyView = new ThreeSixtyView();
      }
      $("#content").html(this.threeSixtyView.el);
      return this.headerView.selectMenuItem("threesixty-menu");
    },
    about: function() {
      if (!this.aboutView) {
        this.aboutView = new AboutView();
      }
      $("#content").html(this.aboutView.el);
      return this.headerView.selectMenuItem("about-menu");
    }
  });

  app = new AppRouter();

  Backbone.history.start();

}).call(this);
