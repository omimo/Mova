AnnotationTrack = function(svg, scale, topleft, listener){
	var thiz = this;

	thiz.selected = null;

	this.svg = svg;
	this.scale = scale;
	this.segmentData = [];
	this.topleft = topleft;
	this.listener = listener;

	this.annotateSelected = function(annotation){
		for(var i in thiz.segmentData){
			if(thiz.segmentData[i].selected){
				thiz.segmentData[i].annotation = annotation;
			}
		}
	}

	this.getSelected= function(){
		for(var i in this.segmentData){
			var d = this.segmentData[i];
			if(d.selected){
				return d;
			}
		}
		return undefined;
	}

	this.deselectAll = function(){
		for(var i in this.segmentData){
			var d = this.segmentData[i];
			d.selected = false;
		}
		this.redraw();
	}

	thiz.getAnnotationData = function(){
		var annotations = [];
		var startOffset = scale.range()[0];
		for(var i in thiz.segmentData){
			var d = thiz.segmentData[i];
			annotations.push(d);
		}
		return annotations;
	}

	this.segments = function(){
		console.log("annotation track # segments ; yet to be converted to time based segment data");
		//use the scale and segment data to create extents
		var _segments = [];
		var startOffset = scale.range()[0];
		for(var i in thiz.segmentData){
			var _t = [scale.invert(thiz.segmentData[i].x + startOffset), scale.invert(thiz.segmentData[i].x + thiz.segmentData[i].width + startOffset)];
			_segments.push(_t);
		}
		return _segments;
	}

	var segmentCounter = 0;
	var track = svg.append("g");

	this.removeSelected = function(){
		for(var i in thiz.segmentData){
			if(thiz.segmentData[i].selected == true){
				thiz.segmentData.splice(i, 1);
				break; //we only want to remove one
			}
		}
		thiz.redraw()
	}

	var backgroundRect = track.append("rect")
		.attr("width", Math.abs(scale.range()[0] - scale.range()[1]))
		.attr("height", 30)
		.attr("class", "track")
		.attr("x", thiz.topleft.x)
		.attr("y", thiz.topleft.y);

	var trackDrag = d3.behavior.drag();
	var segmentDrag = d3.behavior.drag();
	var leftResizeDrag = d3.behavior.drag();
	var rightResizeDrag = d3.behavior.drag();

	var currentStartPos = undefined;
	// TODO make this variables local
	// lastSeg = undefined,
	lastSegData = undefined;

	//this function redraws the extents.
	//Whenever you make change to the view model, i.e. segmentData, calling this method will redraw the extents
	this.redraw = function(){
		//remove any existing children

		//redraw background
		backgroundRect.attr("width", Math.abs(scale.range()[0] - scale.range()[1]))

		var g = track.selectAll("g")
		.data(thiz.segmentData, function(d){
			return d.id;
		})

		var gEnter = g.enter()
		.append("g")
		.attr("id", function(d){
			return d.id;
		})

		gEnter.append("text").attr("class", "annotation-label");

		gEnter.append("rect").attr("class", "segment");

		gEnter.append("rect").attr("class", "resize-left");

		gEnter.append("rect").attr("class", "resize-right");


		g.select("rect.segment")
		.attr("fill", "yellow")
		.attr({
			"x": function(d){return timeScale(d.start)},
			"width": function(d){return (timeScale(d.end) - timeScale(d.start)) },
			"height": 30,
			"y": thiz.topleft.y
		})
		.classed({"selected": function(d){return d.selected}})
		.call(segmentDrag)

		g.select("rect.resize-left")
		.attr({
			"x": function(d){return timeScale(d.start)},
			"width": 5,
			"height": 30,
			"y": thiz.topleft.y
		})
		.call(leftResizeDrag);

		g.select("rect.resize-right")
		.attr({
			"x": function(d){return timeScale(d.end) - 5},
			"width": 5,
			"height": 30,
			"y": thiz.topleft.y
		})
		.call(rightResizeDrag);

		g.select("text.annotation-label")
		.attr({
			"x": function(d){return timeScale(d.start) + 3},
			"width": function(d){return timeScale(d.end) - timeScale(d.start)},
			"height": 30,
			"y": thiz.topleft.y + 20
		})
		.text(function(d){
			return d.annotation;
		})

		g.exit().remove();

	}

	trackDrag.on("dragstart", function(){
		currentStartPos = d3.mouse(this);
		currentStartTime = timeScale.invert(currentStartPos[0]);
		if ( currentStartTime && noOverlap(currentStartTime) ) {
			var nid = nextId();
			// lastSegData = {"id": nid, "x": currentStartPos[0], "width": 0, "selected": false};
			lastSegData = {"id": nid, "start": currentStartTime, "end": currentStartTime, "selected": false};
			thiz.segmentData.push(lastSegData);
			thiz.redraw();
		}
	})
	.on("drag", function(){
		var pos = d3.mouse(this);

		//if out of bounds
		// var lx = thiz.topleft.x;
		// if(pos[0] < lx || (pos[0] > (+track.select("rect.track").attr("width") + lx)) ){
		// 	return;
		// }
		var instant = timeScale.invert(pos[0]);
		var minTime = timeScale.domain()[0];
		var maxTime = timeScale.domain()[1];
		if( instant < minTime ||  instant > maxTime ) {
			return;
		}


		//update only if there is no overlap
		// var t_width = pos[0] - currentStartPos[0];
		// var oldX = lastSegData.x;

		var difference = instant - currentStartTime;
		if(difference < 0){
			//currently the mouse is on left of the starting point
			// lastSegData.x = pos[0];
			lastSegData.start = instant;
			lastSegData.end = currentStartTime;
		}else{
			// lastSegData.x = currentStartPos[0];
			lastSegData.start = currentStartTime;
			lastSegData.end = instant;
		}
	
		// lastSegData.width = Math.abs(t_width);

		thiz.redraw();
	})
	.on("dragend", function(){
		var pos = d3.mouse(this);
		var instant = timeScale.invert(pos[0]);
		// if start and end are same, remove the segment added last
		if(currentStartTime == instant){
			thiz.segmentData.splice(thiz.segmentData.length-1,1);
			thiz.redraw();
		}
	})

	segmentDrag.on("dragstart", function(event){
		currentSegStartPos = d3.mouse(this);
		d3.event.sourceEvent.stopPropagation();
		return false;
	})
	.on("drag", function(){
		// find the segment data

		//update the start and end in segmentData
		var segmentId = d3.select(this).node().parentNode.id;
		var segmentData = null;
		for(var i in thiz.segmentData){
			if(thiz.segmentData[i].id == segmentId){
				// thiz.segmentData[i].x = newX
				segmentData = thiz.segmentData[i];
				break;
			}
		}

		if(segmentData != null){
			// var newX = (+d3.select(this).attr("x")) + (+d3.event.dx);
			var newStart = timeScale.invert( timeScale(segmentData.start) + d3.event.dx );
			var newEnd = timeScale.invert( timeScale(segmentData.end) + d3.event.dx );
			var minTime = timeScale.domain()[0];
			var maxTime = timeScale.domain()[1];

			if(newStart < minTime || newEnd > maxTime){
				return;
			}else{
				segmentData.start = newStart;
				segmentData.end = newEnd;
			}
		}
		
		thiz.redraw();
	})
	.on("dragend", function(){
		var pos = d3.mouse(this);

		//if start and end are same, then select the segment
		if(arrayEquals(pos, currentSegStartPos)){
			if(listener){
				listener('select', thiz);
			}

			var id = d3.select(this).node().parentNode.id;

			for(var i in thiz.segmentData){
				var d = thiz.segmentData[i];

				if(d.id == id){
					var currentSelected = d.selected;
					thiz.deselectAll();
					if(currentSelected == true){
						d.selected = false;
					}else{
						d.selected = true;
					}
					d3.select(this).classed({"selected": d.selected});
					break;
				}
			}
		}
	})

	leftResizeDrag.on("drag", function(d){
		var newStart = timeScale.invert(timeScale(d.start) + d3.event.dx);
		var minTime = timeScale.domain()[0];
		if(newStart < d.end && newStart > minTime){
			d.start = newStart;
		}
		thiz.redraw();
	});

	rightResizeDrag.on("drag", function(d){
		var newEnd = timeScale.invert(timeScale(d.end) + d3.event.dx);
		var maxTime = timeScale.domain()[1];
		if(newEnd > d.start && newEnd < maxTime){
			d.end = newEnd;
		}
		thiz.redraw();
	})



	track.select("rect.track").call(trackDrag);

	track.on("contextmenu", function(){
		d3.event.preventDefault();
		return false;
	})

	function arrayEquals(a1, a2){
		if(a1.length != a2.length){
			return false;
		}

		for(i=0; i<a1.length; i++){
			if(a1[i] != a2[i])
				return false;
		}
		return true;
	}

	function noOverlap(currentTime){
		return true;
	}

	// commented while converting segment data to be time based
	// function noOverlap(xPos, ignore){
	// 	for(i in thiz.segmentData){
	// 		var seg = thiz.segmentData[i];
	// 		if(seg == ignore){} 
	// 		else if( xPos >= seg.x && xPos <= (seg.x + seg.width)) {
	// 			return false;
	// 		}
	// 	}
	// 	return true;
	// }

	function nextId(){
		return "seg" + segmentCounter++;
	}

	return this;
}