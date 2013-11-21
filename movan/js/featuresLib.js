var colormap = ["blue","red","yellow"];
var cmap1 = [d3.rgb(255, 237, 160) , d3.rgb(254, 178, 76), d3.rgb(240, 59, 32)];
var cmap2 = [ d3.rgb(194, 230, 153), d3.rgb(120, 198, 121), d3.rgb(49, 163, 84), d3.rgb(0, 104, 55)];

var f_weight = {
		label: "Weight",
		type: "windows",
		colormap : function(v){return cmap1[v];},
		data: [ ]
};

var f_space = {
		label: "Space",
		type: "windows",
		colormap : function(v){return cmap1[v];},
		data: [ ]
};

var f_time = {
		label: "Time",
		type: "windows",
		colormap :function(v){return cmap2[v];},
		data: [ ]
};

var f_flow = {
		label: "Flow",
		type: "windows",
//		colormap : [d3.rgb(255, 255, 204), d3.rgb(194, 230, 153), d3.rgb(120, 198, 121), d3.rgb(49, 163, 84), d3.rgb(0, 104, 55)],
		colormap : function(v){return cmap1[v];},
		data: [ ]
};

var f_angvel = {
		label: "Velocity",
		type: "windows",
		colormap : function(v){return d3.hsl(0,1,1-v);},
		//colormap : function(v){return d3.rgb(255, 0, 0).brighter(((2*v)));},
		
//		colormap : function(v){return cmap1[v];},

		data: [ ]
};

function makeRandomFeature(frames, skips) {
	var data = [];
	var dCount = 0;
	var start = 1;
	var end;
	var value;
	
	for ( index = 0; index < frames.length; index += skips) {
		ind2 = index/skips;
		
	    if (Math.floor((Math.random()*5)+1) == 1 && start-1<ind2)
	    	{
	    		end = ind2+1;
	    		value = Math.floor((Math.random()*3));
	    		
	    		data[dCount++] = [start,end,value];
	    		start=end+1;
	    		
	    	}
	    
	}
	
	if (end != index/skips) 
		{
		end = index/skips;
		value = Math.floor((Math.random()*3));
		data[dCount++] = [start,end,value];
		}
	
	//console.log(data);
	return data;
}

function calcVelocities(frames, skips, joint) {
	var data = [];
	var dCount = 0;
	var start = 1;
	var end;
	var value;
	var min = 100000;
	var max = -1;

	for ( index = skips; index < frames.length; index += skips) {
		ind2 = index/skips;
		
	    a = Math.pow((frames[index][joint].x-frames[index-skips][joint].x),2);
	    a = a + Math.pow((frames[index][joint].y-frames[index-skips][joint].y),2);
	    v = Math.sqrt(a);
	    start = index/skips -1;
	    end = index/skips;
		data[dCount++] = [start,end,v];
		
		if (v > max)
			max = v;
		if (v <min)
			min = v;
		//console.log(v);
	}
	d = max-min;
	for (i=0;i<data.length;i++)
		data[i][2]=data[i][2]/d;
	
	console.log(data);
	return data;
}