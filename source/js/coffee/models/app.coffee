class window.AppModel extends Backbone.Model

  initialize: ->
    @googleImages = new Backbone.Collection @attributes.googleImages
    #alert 'init'

    @set
      googleImages: @googleImages

  addImage: (image) ->
    console.log @
    @googleImages.add image



# Make this a Singleton
return instance = (instance or new window.AppModel())
