var Parsers = require('./Parsers.js');
var FigureViz = require('./FigureViz.js');

var MovaObject = MovaObject || {};

MovaObject = function (title) {
    this.debug = true;

    this.title = title;
    this.tracks = [];
    this.annotations = [];
    this.features = [];

    this.figureSketch = {
        container: [],
        frameSkip: 5,
        padding: 20
    };

    var self = this;

    //------------------------------------------

    this.log = function(m) {
        if (self.debug)
            console.log(self.title + ": " + m.toString());
    };

    this.loadTrack = function (url,type , callback) {                 
         // Create the Track object
         var track = {
             url: url,
             type: type,
             isMocap: false
         } ;

         if (type in ['bvh']) 
            track.isMocap = true;

         self.log("Loading the track ...");
         // The Parsers.trackReaders will call the proper function
         parser = new Parsers.trackReaders[type](title);
         parser.load(url, function(data) {
             console.log(data);
             self.log("Done!");
         });
    };

};

module.exports = MovaObject;