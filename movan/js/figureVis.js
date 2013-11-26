function drawFiguresCanvas(parent,frames, skel, highlightJ, frameSkip, pad) {
	
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

				var index = 0;
				for ( index = 0; index < frames.length; index += skips) {
					

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

					currentFrame = frames[index].map(function(d) {
						return {
							x : d.x / 2 + 200  + index/skips * padding,
							y : -1 * d.y / 2 + 90 + h / 2,
							z : d.z / 2
						};
					});
					
					rootOffset[index/skips] = currentFrame[0].x;
					//Create SVG element

					/*
					 svg.append("circle")
					 .attr("cx", function(d) {
					 return eye.x;
					 }).attr("cy", function(d) {
					 return eye.y;
					 }).attr("r", 2);
					 */

					//draw joints
					svg.selectAll("circle.f" + index)
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

				}



				return rootOffset;

			}