var anim = {

animIndex : 0,  // Current frame duing animation
playAnim : false,
animSVG : [],  // SVG DOM element for the animation
ds : 4,  // Down-sampling rate

trajJointIndex: 19,
trajFeatIndex: 0,

makeAnim: function (parent,mocap, highlightJ, frameSkip, pad) {

				h = 200;
				w = 600;

				var svg = parent.append("svg")
					.attr("width", w)
					.attr("height", h)
					.attr("overflow","scroll")
					.style("display","inline-block");


				anim.animIndex = 0;

				currentFrame = mocap.getPositionsAt(anim.animIndex).map(function(d) {
					return {
						x : d.x * movan.figureScale + 160,
						y : -1 * d.y * movan.figureScale + 180,
						z : d.z * movan.figureScale
					};
				});

				//bones
				svg.selectAll("line")
				.data(mocap.connectivityMatrix)
				.enter()
				.append("line")
				.attr("stroke", "grey")
				.attr("stroke-width",5)
				.attr("stroke", "black")
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


				svg.selectAll("circle")
				.data(currentFrame)
				.enter()
				.append("circle")
				.attr("cx", function(d) {
					return d.x;
				}).attr("cy", function(d) {
					return d.y;
				}).attr("r", function(d, i) {
					if (i == highlightJ)
						return 5;
					else if (i == movan.skelHeadJoint)
						return 8;
					else
						return 5;
				}).attr("fill", function(d, i) {
					if (i == highlightJ)
						return 'red';
					else
						return 'black';
				});


		// 		if (movan.selectedFeats.length > 0 ) {
		// 			//The line SVG Path we draw
		// 			svg.append("circle")
		// 			.attr("class","traj")
		//             .attr("cx", function(d) {
		// 				return currentFrame[anim.trajJointIndex].x;
		// 			}).attr("cy", function(d) {
		// 				return currentFrame[anim.trajJointIndex].y;
		// 			}).attr("r", 5)
		// 			.attr("fill", function(d) {
		// 	var i = Math.floor(anim.animIndex/movan.frameSkip);
		// 	if (i>=movan.selectedFeats[anim.trajFeatIndex].data.length)
		// 		value = movan.selectedFeats[anim.trajFeatIndex].data[i-movan.frameSkip][2];
		// 	else
		// 		value = movan.selectedFeats[anim.trajFeatIndex].data[i][2];
		// 	return movan.selectedFeats[anim.trajFeatIndex].f.colormap(value);
		// });
		// 		}

				$("#featureList").scrollLeft(0);

				anim.animIndex++;
				if (anim.animIndex >=frames.length)
					anim.animIndex = 0;

				//playAnim=true;
				return svg;

},


drawFigure: function() {
	if (anim.playAnim==false || movan.dataTracks.length < 1) return false;

	else {
	svg = anim.animSVG;
	//console.log(playAnim);
	mocap = movan.dataTracks[movan.dataTracks.length - 1].content;
	currentFrame = mocap.getPositionsAt(anim.animIndex).map(function(d) {
		return {
			x : d.x * movan.figureScale + 160 ,
			y : -1 * d.y * movan.figureScale + 180,
			z : d.z * movan.figureScale
		};
	});


	// svg.append("circle")
	// .attr("class","traj")
 //    .attr("cx", function(d) {
	// 	return currentFrame[anim.trajJointIndex].x;
	// }).attr("cy", function(d) {
	// 	return currentFrame[anim.trajJointIndex].y;
	// }).attr("r", 5)
	// .attr("fill", function(d) {
	// 	var i = Math.floor(anim.animIndex/movan.frameSkip);
	// 	if (i>=movan.selectedFeats[anim.trajFeatIndex].data.length)
	// 		value = movan.selectedFeats[anim.trajFeatIndex].data[i-movan.frameSkip][2];
	// 	else
	// 		value = movan.selectedFeats[anim.trajFeatIndex].data[i][2];
	// 	return movan.selectedFeats[anim.trajFeatIndex].f.colormap(value);
	// });

	//draw joints
	svg.selectAll("circle")
	.data(currentFrame)
	//.transition()
	.attr("cx", function(d) {
		return d.x;
	}).attr("cy", function(d) {
		return d.y;
	})
	// .attr("r", function(d, i) {
		// if (i == movan.selectedJoint)
			// return 4;
		// else if (i == movan.skelHeadJoint)
			// return 4;
		// else
			// return 2;
	// })
	.attr("fill", function(d, i) {
		if (i == movan.selectedJoint)
			return 'red';
		else
			return 'black';
	});

	//bones
	svg.selectAll("line")
	.data(mocap.connectivityMatrix)
	//.transition()
	.attr("stroke", "black")
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


	if (anim.animIndex>0)
		d3.selectAll("#featbox"+Math.floor((anim.animIndex)/movan.frameSkip-1))
		.transition().ease("bounce")
		.attr("height",function(d){
			return d3.select(this).attr("orgheight");
		})
		.attr("y",function(d){
			return d3.select(this).attr("orgtop");
		});

	d3.selectAll("#featbox"+Math.floor((anim.animIndex)/movan.frameSkip)).attr("height",40);
	d3.selectAll("#featbox"+Math.floor((anim.animIndex)/movan.frameSkip)).attr("y",function(d) {
		return d3.select(this).attr("orgtop")-20;
	});


	//if (grootOffset[Math.floor((animIndex)/frameSkip)]-15 > currentFrame[0].x)
	var offset = movan.dataTracks[movan.dataTracks.length - 1].rootOffset[Math.floor((anim.animIndex)/movan.frameSkip)]-400;
		$("#featureList").scrollLeft(offset);
		$("#figure").scrollLeft(offset);

	//anim.animIndex+=anim.ds;
	if (anim.animIndex >=mocap.frameCount) {
			anim.animIndex =0;
			anim.playAnim = false;
			//$( "#btnPlay" ).button('option', 'label', '&nbsp;Play&nbsp;&nbsp;');
			feat.select("#pointline").remove();
			$("#featureList").scrollLeft(0);
		}

	//d3.timer(drawFigure(animSVG,gframes,gskel, selectedJoint,frameSkip,padding), 300);

	return false;
	}
}

};
