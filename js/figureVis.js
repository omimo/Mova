var figureSketch = {

drawFiguresCanvas: function (parent,track, highlightJ, frameSkip, pad) {

				var rootOffset = [];

				padding = pad;
				skips = frameSkip;

				w = (padding)*track.frameCount/skips+300;
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
				//var firstRootX = track.getPositionsAt(0)[0].x;
				for ( index = 0; index < track.frameCount; index += skips) {
					currentFrame = track.getPositionsAt(index).map(function(d,i) {
						var xx;
						if (i==0)
							 xx = d.x * movan.figureScale + 150  + index/skips * padding;
						else
							xx = d.x * movan.figureScale + 150  + index/skips * padding;

						return {
							x : xx,
							y : -1 * d.y * movan.figureScale + 180,
							z : d.z * movan.figureScale
						};
					});

					rootOffset[index/skips] = currentFrame[0].x;
					//Create SVG element
					figureSketch.drawSkel(svg,currentFrame,index, highlightJ,track);
				}
				return rootOffset; //we need this to align the figures with features
	},

// Omid: create a function like this and modify
// we may have to create a conectivityMatrix by our own or do filter
drawSkelPartial: function (svg, currentFrame, index, highlightJ, mocap, neededJoints) {
	//bones
	svg.selectAll("line.f" + index)
	.data(mocap.connectivityMatrix.filter(function(d,i){
		for(var a=0; a<neededJoints.length; a++){
			if(i==neededJoints[a]){
				return d;
			}
		}
	}))
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
	.data(currentFrame.filter(function(d,i){
		for(var a=0; a<neededJoints.length; a++){
			if(i==neededJoints[a]){
				return d;
			}
		}
	}))
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
			return 2;
		else if (i == movan.skelHeadJoint )
			return 4;
		else
			return 2;
	}).attr("fill", function(d, i) {
		if (i == highlightJ)
			return '#555555';
		else
			return '#555555';
	});


},

drawSkel: function (svg, currentFrame, index, highlightJ, mocap) {
	//bones
	svg.selectAll("line.f" + index)
	.data(mocap.connectivityMatrix)
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


drawJointChooserCSV: function (svg, currentFrame, index, highlightJ,skel,clickCallBack) {
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

drawJointChooser: function (svg, currentFrame, mocap, highlightJ, clickCallBack) {
	index = 0;

	//bones
	svg.selectAll("line.f" + index)
	.data(mocap.connectivityMatrix)
	.enter()
	.append("line")
	.attr("stroke", "black")
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

		d3.select("#jointLabel").text(track.jointArray[d3.select(this).attr("jointID")].title);
	})
	.on("mouseout", function (d) {
		d3.select("#jointLabel").text(track.jointArray[highlightJ].title);
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


		clickCallBack(mocap);
	})
	;


},

drawJointChooserbvhtest: function (svg, currentFrame, mocap, clickCallBack) {
	//console.log(currentFrame);

	highlightJ = 1;

	//bones
	svg.selectAll("line.f" + index)
	.data(connectivityMatrix)
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
	svg.selectAll("circle.f")
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

		//d3.select("#jointLabel").text(skel.jointNames[d3.select(this).attr("jointID")]);
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
