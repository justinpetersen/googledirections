window.HeaderView = Backbone.View.extend
  template: "HeaderView"
  initialize: ->
    @render()

  render: ->
    that = this
    $.get "/templates/" + @template + ".html", (template) ->
      $(that.el).html template

    this

  selectMenuItem: ->
