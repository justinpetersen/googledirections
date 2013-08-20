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

  url: ->
    "http://maps.googleapis.com/maps/api/streetview?gid=#{@cid}&size=400x400&location=" + @attributes.coords.lat + "," + @attributes.coords.lng + "&heading=" + @attributes.directionalDegrees + "&sensor=false&key=AIzaSyCyUdEWUkmZFkb1jmDjWi2UmZ345Rvb4sU"

