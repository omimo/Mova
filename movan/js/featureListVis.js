
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
	
	timeline.transition()
	.duration(200)
	.style("stroke", "black")
	  .style("stroke-width", "1");
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
	.text(feature.label+":")
	.attr("x",20)
	.attr("y",25)
	.attr("font-family", "sans-serif")
	.attr("font-size", "11pt");
		
	
	
	svg.selectAll("rect.f_"+feature.title)
		.data(feature.data)
		.enter()
		.append("rect")
		.attr("class", "featBox")
		.attr("id", function(d,i) {return "featbox"+i;})
		.attr("stroke","none")
		.attr("x", function(d,j) {  
			if (feature.type=="bipolar")
				return rootOffset[d[0]]+padding*3/2;//-padding;
			else
				return rootOffset[d[0]]+padding-2;
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
		.attr("width", function(d,j) {
			return rootOffset[d[1]] - rootOffset[d[0]];
		})
		.attr("height", function (d) {
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

function drawFeatureList (parent,rootOffset, feats, padding)
{
 //	w = (padding)*frames.length/skips+300;
 	w = (padding)*rootOffset.length+300;
   	h = 200;
   	
   	feat_h = 40;
   	
   //console.log(rootOffset);
   	
   	//var list = parent.append("div").attr("width", w).attr("height", h);
   	list = parent;
   
   	 
   	 for (f=0;f<feats.length;f++)
   		 {
   		 		var fsvg = list.append("svg").attr("width", w).attr("height", feat_h).attr("display"," block")
   		 		.style("cursor","pointer");//.append("div").attr("id","feat-"+f).style("width", w+"px").style("height", feat_h+"px");
   		 		ff = feats[f];

   		 		timeline(fsvg,rootOffset,feats[f]);

   		 		
   		 }
   	
}

