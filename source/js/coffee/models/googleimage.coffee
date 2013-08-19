#class window.GoogleImages extends Backbone.Collection
#  model: window.GoogleImage
#
#  initialize: ->
#    @logger = Logger.get 'Images'

class window.GoogleImage extends Backbone.Model
  defaults:
    url: ''
    directionalDegrees: ''
    coords: {}

  initiialize: ->
    alert 'google'
