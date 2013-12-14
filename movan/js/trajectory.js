var trajectory = {
	
		drawTrajectory: function(canv, frames, joint, ind1, ind2) {
			var svg = canv.append("svg").attr("width",400).attr("height",300);
			var nframes = [];
			
			var cx = frames[0][0].x;
			var cy = frames[0][0].y;
			var cz = frames[0][0].z;
			
			for (i=0;i<frames.length;i++) {
				nframes[i] = frames[i].map(function(d) {
					return {
						x : (d.x - cx) +180,
						y : -1*(d.y - cy)+180,
						z : (d.z - cz)+180
					};
				});
			}
			
			var lineFunctionXY = d3.svg.line()
            .x(function(d) { return d[joint].x; })
            .y(function(d) { return d[joint].y; })
             .interpolate("linear");

			var lineFunctionXZ = d3.svg.line()
            .x(function(d) { return d[joint].x; })
            .y(function(d) { return d[joint].z; })
             .interpolate("linear");
			
			var lineFunctionYZ = d3.svg.line()
            .x(function(d) { return d[joint].y; })
            .y(function(d) { return d[joint].z; })
             .interpolate("linear"); //basis

			//The line SVG Path we draw
			svg.append("path")
                .attr("d", lineFunctionXY(nframes))
                .attr("stroke", "blue")
                .attr("stroke-width", 2)
                .attr("fill", "none");

			svg.append("path")
            .attr("d", lineFunctionXZ(nframes))
            .attr("stroke", "green")
            .attr("stroke-width", 2)
            .attr("fill", "none");
			
			svg.append("path")
            .attr("d", lineFunctionYZ(nframes))
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("fill", "none");
		},
		


};