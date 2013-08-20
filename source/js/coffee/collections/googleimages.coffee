class window.GoogleImages extends Backbone.Collection
  model: GoogleImages

  initialize: ->
    @logger = Logger.get 'Images'

  addImage: (image) ->
    @add image
