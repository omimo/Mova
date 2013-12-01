
var padding = 17;

var overlay = [];


function mouseOverGroup(feature,rootOffset) {
	d3.select("body").selectAll("div.over")
	.style("opacity", 0)
   .remove();
	
	d3.select("body").select("#figure").selectAll("div")	
	.data(feature.data)
	.enter()
	.append("div")
	.attr("class","over")
	.style("left",function(d,j) {   
		return rootOffset[d[0]-1]-padding+"px";
	})
	.style("top",10+"px")
	.style("width", function(d,j) {
		return rootOffset[d[1]-1] - rootOffset[d[0]-1]+padding*2+"px";
	})
	.style("height",200+"px")
	.style("background-color", function(d) {
		return feature.colormap(d[2]);
	})
//	.transition()
//        .duration(2500)
//        .style("opacity", 0)
//        .remove()
        ;
	
};


function mouseOverGroup2(feature,rootOffset,timeline) {
	d3.select("#figure").select("svg").selectAll("rect").remove();
	
	parent=d3.select("body").select("#figure").select("svg");
	
	var defs = parent.append('defs');
	var g = defs.append("pattern")
	    .attr('id', 'hash1')
	    .attr('patternUnits', 'userSpaceOnUse')
	    .attr('width', '15')
	    .attr('height', '15')
	    .append("g").style("fill", "red")
	    .style("stroke", "red")
	    .style("stroke-width", .4)
		.append("path").attr("d", "M0,0 l15,15");
	
	var g = defs.append("pattern")
	    .attr('id', 'hash2')
	    .attr('patternUnits', 'userSpaceOnUse')
	    .attr('width', '15')
	    .attr('height', '15')
	    .append("g").style("fill", "red")
	    .style("stroke", "blue")
	    .style("stroke-width", .4)
	    .append("path").attr("d", "M15,0 l-15,15");
	
	timeline.select("#featLabel")
	.attr("font-weight", "bold");
	
	if (feature.type == "segments") {
		parent.selectAll("rect.o")
		.data(feature.data)
		.enter()
		.insert("rect",":first-child")
		.attr("class", "over")
		.attr("stroke","none")
		.attr("x", function(d,j) {  
				return rootOffset[d[0]]+3;//-padding;
		})
		.attr("y",parent.attr("y")+10)
		.attr("width", function(d,j) {
			return rootOffset[d[1]] - rootOffset[d[0]]-3;
		})
		.attr("height",200)
		.attr("fill", function(d,i) {
			return feature.colormap(d[2],i);
		})
		.attr("fill", function(d,i) {
			if (i%2 ==0)
				return "url(#hash1)";
			else
				return "url(#hash2)";
		})
		.attr("stroke-width",0.2)
		.attr("stroke", d3.rgb(0,0,0))
		.transition()
		.duration(500)
		.attr("fill-opacity",0.6)
		;
	}
	else {
	parent.selectAll("rect.o")
	.data(feature.data)
	.enter()
	.insert("rect",":first-child")
	.attr("class", "over")
	.attr("stroke","none")
	.attr("x", function(d,j) {  
			if (feature.type!="bipolar")
				return rootOffset[d[0]];//-padding;
			else
				return rootOffset[d[0]]+padding/2;
	})
	.attr("y",10)
	.attr("width", function(d,j) {
		return rootOffset[d[1]] - rootOffset[d[0]];
	})
	.attr("height",parent.attr("height")-10)
	.attr("fill", function(d,i) {
		return feature.colormap(d[2],i);
	}).transition()
	.duration(500)
	.attr("fill-opacity",0.6)
	;
	}
	

//	.transition()
//        .duration(2500)
//        .style("opacity", 0)
//        .remove()
        ;
	
};

var mouseOutGroup = function (timeline) {
	d3.select("#figure").select("svg").selectAll("rect").transition()
	.duration(500)
	.style("opacity", 0)
   .remove();
	
	timeline.select("#featLabel")
	.transition().duration(200)
	.attr("font-weight", "normal");
	
	timeline.transition()
	.duration(200)
	.style("stroke", "none")
	  .style("stroke-width", "1");
	//visualRoot.selectAll(".circle").remove()
};

function timeline(parent,rootOffset, feature)
{
	parent.on("mouseover", function(d,i) {
			mouseOverGroup2(feature,rootOffset,parent);
		})
		.on("mouseleave", function(d) {
			mouseOutGroup(parent);
		});

	//svg=parent.append("svg").attr("width", w).attr("height", feat_h);;
	svg = parent;
	

	
	svg.append("text")
	.attr("id","featLabel")
	.text(feature.label+":")
	.attr("x",20)
	.attr("y",25)
	.attr("font-family", "sans-serif")
	.attr("font-size", "11pt");
		
	
	if (feature.type == "segments") {

		svg.selectAll("rect.f_"+feature.title)
			.data(feature.data)
			.enter()
			.append("rect")
			.attr("class", "featBox")
			.attr("id", function(d,i) {return "featbox"+i;})
			.attr("stroke","none")
			.attr("x", function(d) {
				return rootOffset[d[0]];
			})
			.attr("y", 20)
			.attr("orgtop", 20)
			.attr("width", function(d,j) {
				return rootOffset[d[1]] - rootOffset[d[0]] - 6;
			})
			.attr("height", 6)
			.attr("orgheight", 6)
			.attr("fill", function(d,i) {
				return feature.colormap(d[2],i);
			})
			.attr("fill2","url(#hash)")
			.attr("orgfill", function(d) {
				return feature.colormap(d[2]);
			})
			.attr("val",  function(d) {
				return (d[2]);
			})
			;
	}
	else {
	svg.selectAll("rect.f_"+feature.title)
		.data(feature.data)
		.enter()
		.append("rect")
		.attr("class", "featBox")
		.attr("id", function(d,i) {return "featbox"+i;})
		.attr("stroke","none")
		.attr("x", function(d,j) {  
			if (feature.type!="bipolar")
				return rootOffset[d[0]];//-padding;
			else
				return rootOffset[d[0]]+padding/2;
			//console.log(rootOffset[d[0]-1]-padding);

		})
		.attr("y", function(d) {
			if (feature.type=="bipolar") {
				if (d[2]>0)
					return 10;
				else
					return 20;
			}
			else 
				return 10;
		})
		.attr("orgtop", function(d) {
			if (feature.type=="bipolar") {
				if (d[2]>0)
					return 10;
				else
					return 20;
			}
			else 
				return 10;
		})
		.attr("width", function(d,j) {
			return rootOffset[d[1]] - rootOffset[d[0]];
		})
		.attr("height", function (d) {
			if (feature.type=="bipolar")
				return 10;
			else
				return 20;
		})
		.attr("orgheight", function (d) {
			if (feature.type=="bipolar")
				return 10;
			else
				return 20;
		})
		.attr("fill", function(d,i) {
			return feature.colormap(d[2],i);
		})
		.attr("orgfill", function(d) {
			return feature.colormap(d[2]);
		})
		.attr("val",  function(d) {
			return (d[2]);
		})
		;
}
	
	// Draw Legends

	var legitemW = ($("#legends").width()-20)/feature.range.length;
	
	legsvg = d3.select("#legends").append("svg").attr("height","80px");
	
	legsvg.append("text")
	.text(feature.label+" ("+feature.unit+")")
	.attr("y",15)
	.attr("x", 10)
	.attr("font-family", "sans-serif")
	.attr("font-size", "11pt");
	
	
	legsvg.selectAll("rect.legitem")
	.data(feature.range)
	.enter()
	.append("rect")
	.attr("class", "legitem")
	.attr("y",20)
	.attr("x", function (d,i) {
		return legitemW*i;
	})
	.attr("width",legitemW)
	.attr("height",15)
	.attr("fill", function (d,i) {
		return feature.colormap(d,i);
	})
	;
	
	if (feature.type == "segments")
		return;
	
	legsvg.selectAll("text.legitem")
	.data(feature.rangelabels)
	.enter()
	.append("text")
	.attr("text-anchor","end")
	.attr("transform", function(d,i) {
		return "translate("+(legitemW*i+legitemW/2+5)+",40)rotate(-90)";
	})
	.attr("y2",50)
	.attr("x2", function (d,i) {
		return legitemW*i+legitemW/2;
	})
	.text(function(d,i) {
		return d;
	})
	.attr("font-family", "sans-serif")
	.attr("font-size", "8pt");
	;
}

function drawFeatureList (parent,rootOffset, feats, padding)
{
 	w = (padding)*movan.gframes.length/movan.frameSkip+300;
 //	w = (padding)*rootOffset.length+300;
   	h = 200;
   	
   	feat_h = 40;
   	
   //console.log(rootOffset);
   	
   	var leg = d3.select("#legends").selectAll("svg").remove();
   	list = parent;
   
   	 
   	 for (f=0;f<feats.length;f++)
   		 {
   		 		var fsvg = list.append("svg").attr("width", w).attr("height", feat_h).attr("display"," block")
   		 		.style("cursor","pointer");//.append("div").attr("id","feat-"+f).style("width", w+"px").style("height", feat_h+"px");
   		 		ff = feats[f];

   		 		timeline(fsvg,rootOffset,feats[f]);

   		 		
   		 }
   	
}

