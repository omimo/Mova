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

    this.loadTrack = function (url,format , callback) {                 
         // Create the Track object
         var track = {
             url: url,
             format: format,
             isMocap: false
         } ;
         
         if (format in {'bvh':1,'c3d':1}) 
            track.isMocap = true;

         self.log("Loading the track ...");
         // The Parsers.trackReaders will call the proper function
         parser = new Parsers.trackReaders[format](title);
         parser.load(url, function(data) {
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

    this.drawFigure = function (container, track, i) {
        if (track.isMocap){
            self.figureSketchConfig.container = container;

            FigureViz.drawFigure(container,track.data,self.figureSketchConfig, i);                        
        } else {
            self.err("The track does not contain mocap data.");
        }
        
    };

};

module.exports = MovaObject;