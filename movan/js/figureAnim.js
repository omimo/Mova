

function makeAnim(parent,frames, skel, highlightJ, frameSkip, pad) {
	
				//var rootOffset = [];

				padding = pad;
				skips = frameSkip;
				
				w = (padding)*4+500;
				h = 200;
				


				var svg = parent.append("svg")
					.attr("width", w)
					.attr("height", h)
					.attr("overflow","scroll")
					.style("display","inline-block");

				
				animIndex = 0;
				

				currentFrame = frames[animIndex].map(function(d) {
					return {
						x : d.x / 2 + 400 ,
						y : -1 * d.y / 2 + 90 + h / 2,
						z : d.z / 2
					};
				});
				
				//rootOffset[animIndex/skips] = currentFrame[0].x;
				
				svg.selectAll("circle")
				.data(currentFrame)
				.enter()
				.append("circle")
				.attr("cx", function(d) {
					return d.x;
				}).attr("cy", function(d) {
					return d.y;
				}).attr("r", function(d, i) {
					if (i == highlightJ - 1)
						return 4;
					else if (i == skelHeadJoint -1)
						return 4;
					else
						return 2;
				}).attr("fill", function(d, i) {
					if (i == highlightJ - 1)
						return 'red';
					else
						return 'black';
				});

				//bones
				svg.selectAll("line")
				.data(skel.connections)
				.enter()
				.append("line")
				.attr("stroke", "black")
				//.attr("x1",0).attr("x2",0)
				//.transition().duration(1000).ease("elastic")
				.attr("x1", function(d, j) {
					return currentFrame[d.a].x;
				})
				.attr("x2", function(d, j) {
					return currentFrame[d.b].x;
				})
				.attr("y1", function(d, j) {
					return currentFrame[d.a].y;
				})
				.attr("y2", function(d, j) {
					return currentFrame[d.b].y;
				});
				
				$("#featureList").scrollLeft(0);
				
				animIndex++;
				if (animIndex >=frames.length)
					animIndex = 0;
				
				animSVG = svg;
				//playAnim=true;
				return svg;
				
}


function drawFigure() {
	if (playAnim==false) return false;
	else {
	svg = animSVG;
	//console.log(playAnim);
	currentFrame = gframes[animIndex].map(function(d) {
		return {
			x : d.x / 2 + 400 ,
			y : -1 * d.y / 2 + 90 + h / 2,
			z : d.z / 2
		};
	});
	
	//draw joints
	svg.selectAll("circle")
	.data(currentFrame)
	//.transition()
	.attr("cx", function(d) {
		return d.x;
	}).attr("cy", function(d) {
		return d.y;
	}).attr("r", function(d, i) {
		if (i == selectedJoint - 1)
			return 4;
		else if (i == skelHeadJoint -1)
			return 4;
		else
			return 2;
	}).attr("fill", function(d, i) {
		if (i == selectedJoint - 1)
			return 'red';
		else
			return 'black';
	});

	//bones
	svg.selectAll("line")
	.data(gskel.connections)
	//.transition()
	.attr("stroke", "black")
		.attr("x1", function(d, j) {
		return currentFrame[d.a].x;
	})
	.attr("x2", function(d, j) {
		return currentFrame[d.b].x;
	})
	.attr("y1", function(d, j) {
		return currentFrame[d.a].y;
	})
	.attr("y2", function(d, j) {
		return currentFrame[d.b].y;
	});

	
	
	// highlight the feature box
	feat = d3.select("#featureList");//.selectAll("rect#featbox"+Math.floor((animIndex-1)/frameSkip));
//	if (old != null) {
//		console.log(Math.floor((animIndex)/frameSkip));
//		
//		old.attr("fill", old.attr("orgfill"));
//	}
	
//	d3.select("body").selectAll("rect#featbox"+Math.floor(animIndex/frameSkip))
//	.attr("fill", "blue");	
	
//	feat.select("#pointline").remove();
//	feat.insert("div",":first-child")
//	.attr("id","pointline")
//	.style("position", "absolute")
//	.style("left", function(d) {
////		if (grootOffset[Math.floor((animIndex)/frameSkip)]-15 > currentFrame[0].x+200)	
////			return currentFrame[0].x+200+"px";
////		else
//			return 	grootOffset[Math.floor((animIndex)/frameSkip)]-15+"px";
//	})
//	.style("top", 200)
//	.style("height", 200+"px")
//	.style("width", 40+"px")
//	.style("border","1px solid steelblue")
//	//.style("background-color", "steelblue")
//	;
	
	
	if (animIndex>0)
		d3.selectAll("#featbox"+Math.floor((animIndex)/frameSkip-1))
		.transition().ease("bounce")
		.attr("height",function(d){
			return d3.select(this).attr("orgheight");
		})
		.attr("y",function(d){
			return d3.select(this).attr("orgtop");
		});
	
	d3.selectAll("#featbox"+Math.floor((animIndex)/frameSkip)).attr("height",40);
	d3.selectAll("#featbox"+Math.floor((animIndex)/frameSkip)).attr("y",function(d) {
		return d3.select(this).attr("orgtop")-20;
	});

	
	//if (grootOffset[Math.floor((animIndex)/frameSkip)]-15 > currentFrame[0].x)		
		$("#featureList").scrollLeft(grootOffset[Math.floor((animIndex)/frameSkip)]-400);

	
	animIndex+=4;
	if (animIndex >=gframes.length)
		{animIndex =0;playAnim = false;$( "#btnPlay" ).button('option', 'label', 'Play');feat.select("#pointline").remove();$("#featureList").scrollLeft(0);}
	
	//d3.timer(drawFigure(animSVG,gframes,gskel, selectedJoint,frameSkip,padding), 300);
	
	return false;
	}
}