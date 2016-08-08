var Parsers = require('./Parsers.js');
var FigureViz = require('./FigureViz.js');

var MovaObject = MovaObject || {};

MovaObject = function (title) {
    this.debug = true;
    this.debugErr = true;

    this.title = title;
    this.tracks = [];
    this.annotations = [];
    this.features = [];

    this.figureSketchConfig = {
        container: [],
        frameSkip: 20,
        padding: 50,
        figureScale: 1,
        highlightJoint: -1,
        skelHeadJoint: -1
    };

    var self = this;

    //------------------------------------------

    this.log = function(m) {
        if (self.debug)
            console.log(self.title + ": " + m.toString());
    };

    this.err = function(m) {
        if (self.debugErr)
            console.log("ERROR - "+ self.title + ": " + m.toString());
    };

    this.loadTrack = function (url,type , callback) {                 
         // Create the Track object
         var track = {
             url: url,
             type: type,
             isMocap: false
         } ;

         if (type in ['bvh','c3d']) 
            track.isMocap = true;

         self.log("Loading the track ...");
         // The Parsers.trackReaders will call the proper function
         parser = new Parsers.trackReaders[type](title);
         parser.load(url, function(data) {
             console.log(data);
             track.data = data;
             self.log("Done!");
             if (callback)
                callback();
         });

         self.tracks.push(track);
    };

    this.drawFigureSketch = function (container, track, s, e) {
        if (track.isMocap){
            self.figureSketchConfig.container = container;

            FigureViz.drawFigureSketch(container,track.data,self.figureSketchConfig, s, e);                        
        } else {
            self.err("The track does not contain mocap data.");
        }
        
    };

};

module.exports = MovaObject;