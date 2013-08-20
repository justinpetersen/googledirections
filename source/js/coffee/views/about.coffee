window.AboutView = Backbone.View.extend
  template: "AboutView"
  initialize: ->
    @render()

  render: ->
    that = this
    $.get "/templates/" + @template + ".html", (template) ->
      $(that.el).html template

    this
