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
			var _t = {
				"start"		: scale.invert(thiz.segmentData[i].x + startOffset),
				"end"		: scale.invert(thiz.segmentData[i].x + thiz.segmentData[i].width + startOffset),
				"annotation": thiz.segmentData[i].annotation
			}

			annotations.push(_t);
		}
		return annotations;
	}

	this.segments = function(){
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

	var currentStartPos = undefined;
	// TODO make this variables local
	// lastSeg = undefined,
	lastSegData = undefined;

	//this function redraws the extents.
	//Whenever you make change to the view model, i.e. segmentData, calling this method will redraw the extents
	this.redraw = function(){
		//remove any existing children
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
		
		g.select("rect.segment")
		.attr("fill", "yellow")
		.attr({
			"x": function(d){return d.x},
			"width": function(d){return d.width},
			"height": 30,
			"y": thiz.topleft.y
		})
		.classed({"selected": function(d){return d.selected}})
		.call(segmentDrag)

		g.select("text.annotation-label")
		.attr({
			"x": function(d){return d.x + 3},
			"width": function(d){return d.width},
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
			if(currentStartPos && noOverlap(currentStartPos[0])){
				var nid = nextId();
				lastSegData = {"id": nid, "x": currentStartPos[0], "width": 0, "selected": false};
				thiz.segmentData.push(lastSegData);
				thiz.redraw();
			}
		})
		.on("drag", function(){
			var pos = d3.mouse(this);

			//if out of bounds
			var lx = thiz.topleft.x;
			if(pos[0] < lx || (pos[0] > (+track.select("rect.track").attr("width") + lx)) ){
				return;
			}

			//update only if there is no overlap
			var t_width = pos[0] - currentStartPos[0];
			var oldX = lastSegData.x;

			if(t_width < 0){
				//currently the mouse is on left of the starting point
				lastSegData.x = pos[0];
			}else{
				lastSegData.x = currentStartPos[0];
			}
		
			lastSegData.width = Math.abs(t_width);

			if(!noOverlap(lastSegData.x, lastSegData)){
				console.log("overlap");
			}
			
			thiz.redraw();
		})
		.on("dragend", function(){
			var pos = d3.mouse(this);

			if(pos && noOverlap(pos[0])){

			}

			if(arrayEquals(pos, currentStartPos)){
				thiz.segmentData.splice(thiz.segmentData.length-1,1);
				thiz.redraw();
			}else{

			}
		})

	segmentDrag.on("dragstart", function(event){
		currentSegStartPos = d3.mouse(this);
		d3.event.sourceEvent.stopPropagation();
		return false;
	})
	.on("drag", function(){
		
		var newX = (+d3.select(this).attr("x")) + (+d3.event.dx);

		if(newX < thiz.topleft.x || (newX + +d3.select(this).attr("width")) > (+track.select("rect.track").attr("width") + thiz.topleft.x)){
			return;
		}

		//update the x position in segmentData
		var segmentId = d3.select(this).node().parentNode.id;
		for(var i in thiz.segmentData){
			if(thiz.segmentData[i].id == segmentId){
				thiz.segmentData[i].x = newX
				break;
			}
		}
		thiz.redraw();
	})
	.on("dragend", function(){
		var pos = d3.mouse(this);
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

	track.call(trackDrag);

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

	function noOverlap(xPos, ignore){
		for(i in thiz.segmentData){
			var seg = thiz.segmentData[i];
			if(seg == ignore){} 
			else if( xPos >= seg.x && xPos <= (seg.x + seg.width)) {
				return false;
			}
		}
		return true;
	}

	function nextId(){
		return "seg" + segmentCounter++;
	}

	return this;
}