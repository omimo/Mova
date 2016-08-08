var d3 = require('d3');


var FigureViz = FigureViz || {};

FigureViz.figureSketchConfig = [];
FigureViz.track = [];


FigureViz.drawFigureSketch = function (container,track, figureSketchConfig, _startIndex, _endIndex) {
                FigureViz.track = track;
                FigureViz.figureSketchConfig = figureSketchConfig;

                var parent = d3.select("body").select(container);            
				var rootOffset = [];

				padding = figureSketchConfig.padding;
				skips = figureSketchConfig.frameSkip;

				w = (padding)*track.frameCount/skips+300;
				h = figureSketchConfig.figureScale*100;


				var svg = parent.append("svg")
					.attr("width", w)
					.attr("height", h)
					.attr("overflow","scroll")
					.style("display","inline-block");



				var borderPath = svg.append("rect")
				.attr("x", 0)
				.attr("y", 0)
				.attr("height", h)
				.attr("width", w)
				.style("stroke", "black")
				.style("fill", "none")
				.style("stroke-width", 0);


				/////////////////////
				//var firstRootX = track.getPositionsAt(0)[0].x;

                var startIndex = 0;
                var endIndex = track.frameCount;

                if (_startIndex && _endIndex) {
                    startIndex = _startIndex;
                    endIndex = _endIndex;
                }

				for ( index = startIndex; index < endIndex; index += skips) {
					currentFrame = track.getPositionsAt(index).map(function(d,i) {
                        index2 = index - startIndex;
						var xx;
						if (i==startIndex)
							 xx = d.x * figureSketchConfig.figureScale + 150  + index2/skips * padding;
						else
							xx = d.x * figureSketchConfig.figureScale + 150  + index2/skips * padding;

						return {
							x : xx,
							y : -1 * d.y * figureSketchConfig.figureScale + h,
							z : d.z * figureSketchConfig.figureScale
						};
					});

					rootOffset[index/skips] = currentFrame[0].x;
					//Create SVG element
					FigureViz.drawSkel(svg,currentFrame,index);
				}
				return rootOffset; //we need this to align the figures with features
	};


FigureViz.drawSkel = function (svg, currentFrame, index) {
    //bones
	svg.selectAll("line.f" + index)
	.data(FigureViz.track.connectivityMatrix)
	.enter()
	.append("line")
	.attr("stroke", "grey")
	.attr("stroke-width",1)
	.attr("x1",0).attr("x2",0)
	//.transition().duration(1000).ease("elastic")
	.attr("x1", function(d, j) {
		return currentFrame[d[0].jointIndex].x;
	})
	.attr("x2", function(d, j) {
		return currentFrame[d[1].jointIndex].x;
	})
	.attr("y1", function(d, j) {
		return currentFrame[d[0].jointIndex].y;
	})
	.attr("y2", function(d, j) {
		return currentFrame[d[1].jointIndex].y;
	});



	//draw joints
	svg.selectAll("circle.f" + index)
	.data(currentFrame)
	.enter()
	.append("circle")
	.attr("class", function(d,i) {
		return "figJoint figJointId"+i;
	})
	.attr("cx", function(d) {
		return d.x;
	}).attr("cy", function(d) {
		return d.y;
	}).attr("r", function(d, i) {
		if (i == FigureViz.figureSketchConfig.highlightJoint)
			return 4;
		else if (i == FigureViz.figureSketchConfig.skelHeadJoint )
			return 4;
		else
			return 2;
	}).attr("fill", function(d, i) {
		if (i == FigureViz.figureSketchConfig.highlightJoint)
			return 'red';
		else
			return '#555555';
	});


};


module.exports = FigureViz;