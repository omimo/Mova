var colormap = ["blue","red","yellow"];


var f_weight = {
		label: "Weight",
		type: "windows",
		colormap : [d3.rgb(255, 237, 160) , d3.rgb(254, 178, 76), d3.rgb(240, 59, 32)],
		data: [ ]
};

var f_space = {
		label: "Space",
		type: "windows",
		colormap : [d3.rgb(255, 237, 160) , d3.rgb(254, 178, 76), d3.rgb(240, 59, 32)],
		data: [ ]
};

var f_time = {
		label: "Time",
		type: "windows",
		colormap : [d3.rgb(255, 237, 160) , d3.rgb(254, 178, 76), d3.rgb(240, 59, 32)],
		data: [ ]
};

var f_flow = {
		label: "Flow",
		type: "windows",
//		colormap : [d3.rgb(255, 255, 204), d3.rgb(194, 230, 153), d3.rgb(120, 198, 121), d3.rgb(49, 163, 84), d3.rgb(0, 104, 55)],
		colormap : [d3.rgb(255, 237, 160) , d3.rgb(254, 178, 76), d3.rgb(240, 59, 32)],
		data: [ ]
};

var f_angvel = {
		label: "Velocity",
		type: "windows",
		colormap : [d3.rgb(255, 237, 160) , d3.rgb(254, 178, 76), d3.rgb(240, 59, 32)],
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
	
	console.log(data);
	return data;
}