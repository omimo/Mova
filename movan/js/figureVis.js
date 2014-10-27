var figureSketch = {
	
drawFiguresCanvas: function (parent,frames, skel, highlightJ, frameSkip, pad) {
	
				var rootOffset = [];

				padding = pad;
				skips = frameSkip;
				
				w = (padding)*frames.length/skips+300;
				h = 200;
				


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
				
				var index = 0;
				var eye = {
						x : w / 2 - 900 + index * 15,
						y : h / 2,
						z : 800
					};

					/*
					 currentFrame = frames[index].map(function(d) {
					 return {x:(eye.z * (d.x-eye.x)) / (eye.z + d.z) + eye.x,
					 y: (eye.z * (d.y-eye.y)) / (eye.z + d.z) + eye.y,
					 z:d.z/2
					 };
					 });*/

				
					
					////////////
				
				
				for ( index = 0; index < frames.length; index += skips) {
					

					var eye = {
						x : w / 2 +100 + index/skips * padding,
						y : h/2,
						z : 800
					};

					
//					 currentFrame = frames[index].map(function(d) {
//					 return {x:(eye.z * (d.x-eye.x)) / (eye.z + d.z) + eye.x,
//					 y: (eye.z * (d.y-eye.y)) / (eye.z + d.z) + eye.y,
//					 z:d.z/2
//					 };
//					 });
					 
		
					currentFrame = frames[index].map(function(d) {
						return {
							x : d.x * movan.figureScale + 500  + index/skips * padding,
							y : -1 * d.y * movan.figureScale+ 90 + h / 2,
							z : d.z * movan.figureScale +200
						};
					});
					
					rootOffset[index/skips] = currentFrame[0].x;
					//Create SVG element
					figureSketch.drawSkel(svg,currentFrame,index, highlightJ,skel);
			
					

				}



				return rootOffset;

	},


drawSkel: function (svg, currentFrame, index, highlightJ,skel) {
	//bones
	svg.selectAll("line.f" + index)
	.data(skel.connections)
	.enter()
	.append("line")
	.attr("stroke", "grey")
	.attr("stroke-width",1)
	.attr("x1",0).attr("x2",0)
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
		if (i == highlightJ)
			return 4;
		else if (i == movan.skelHeadJoint )
			return 4;
		else
			return 2;
	}).attr("fill", function(d, i) {
		if (i == highlightJ)
			return 'red';
		else
			return '#555555';
	});

	
},


drawJointChooser: function (svg, currentFrame, index, highlightJ,skel,clickCallBack) {
	//bones
	svg.selectAll("line.f" + index)
	.data(skel.connections)
	.enter()
	.append("line")
	.attr("stroke", "black")
	.attr("x1",0).attr("x2",0)
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
	
	
	//draw joints
	svg.selectAll("circle.f" + index)
	.data(currentFrame)
	.enter()
	.append("circle")
	.style("cursor","pointer")
	.attr("cx", function(d) {
		return d.x;
	}).attr("cy", function(d) {
		return d.y;
	}).attr("r", function(d, i) {
		if (i == highlightJ)
			return 6;
		else if (i == movan.skelHeadJoint)
			return 6;
		else
			return 5;
	})
	.attr("jointID", function(d,i){return i;})
	.attr("fill", function(d, i) {
		if (i == highlightJ )
			return 'red';
		else
			return 'black';
	})
	.on("mouseover", function (d) {
		d3.select(this).attr("r",6).attr("fill", "orange");
		
		d3.select("#jointLabel").text(skel.jointNames[d3.select(this).attr("jointID")]);
	})
	.on("mouseout", function (d) {
		d3.select("#jointLabel").text(skel.jointNames[highlightJ]);
		r = 2;
		if (i == highlightJ)
			r= 6;
		else if (i == movan.skelHeadJoint)
			r= 6;
		else
			r = 5;
		d3.select(this).attr("r",r);
		
		if ( d3.select(this).attr("jointID") == highlightJ)
			d3.select(this).attr("fill","red");
		else
			d3.select(this).attr("fill","black");
	})
	.on("click", function(d) {
		//movan.selectedJoint = d3.select(this).attr("jointID");
		d3.select("#jointDropdown").attr("selectedJoint", d3.select(this).attr("jointID"));
		highlightJ = d3.select(this).attr("jointID");
		//d3.select("#jointLabel").text(movan.gskel.jointNames[d3.select("#jointDropdown").attr("selectedJoint")]);
		//d3.select("#jointLabel").text(movan.gskel.jointNames[d3.select(this).attr("jointID")]);

		
		clickCallBack();
	})
	;

	
},

drawSkelInfo: function (parent, currentFrame, skel) {
	
	var svg = parent.append("svg").attr("width", 250).attr("height", 200);
	
	console.log(currentFrame);
	var currentFrame2 = currentFrame.map(function(d) {
		return {
			x : d.x * movan.figureScale + 100,
			y : -1 * d.y * movan.figureScale + 90 + 75,
			z : d.z * movan.figureScale
		};
	});
	
	currentFrame = currentFrame2;
	//joints
	svg.selectAll("circle")
	.data(currentFrame)
	.enter()
	.append("circle")
	//.transition()
	.attr("cx", function(d) {
		return d.x;
	}).attr("cy", function(d) {
		return d.y;
	})
	.attr("r", function(d, i) {
					if (i == movan.skelHeadJoint)
						return 8;
					else
						return 5;
	})
	.attr("fill", 'black');

	svg.selectAll("text")
	.data(currentFrame)
	.enter()
	.append("text")
	.text(function (d,i) {
		return "";//skel.jointNames[i];
	})
	.attr("x", function(d) {
		return d.x;
	})
	.attr("y", function (d) {
		return d.y;
	});
	
	//bones
	svg.selectAll("line")
	.data(movan.gskel.connections)
	.enter()
	.append("line")
	//.transition()
	.attr("stroke", "black")
	.attr("stroke-width",6)
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

	
}

};
