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
		colormap : function(v){return d3.hsl(0,1,1-(v/255));},
		data: [ ]
};

var f_aveangvel = {
		label: "AveVelocity",
		type: "windows",
		colormap : function(v){return d3.hsl(0,1,1-(v/255));},
		data: [ ]
};

var f_accel = {
		label: "Acceleration",
		type: "windows",
		colormap : function(v){return d3.hsl(0,1,1-(v/255));},
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
	    		start=end;
	    		
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
	    v = Math.sqrt(a)/(skips*inputFPS);
	    start = Math.floor(index/skips) -1;
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
		data[i][2]=data[i][2];
	
	return data;
}

function calcAveVelocities(frames, skips, joint) {
	var data = [];
	var dCount = 0;
	var start = 1;
	var end;
	var value;
	var min = 100000;
	var max = -1;

	for ( index = skips; index < frames.length; index += skips) {
		ind2 = index/skips;
		
		sum = 0;
		for (j=index+1;j<index+skips;j++) {
			 a = Math.pow((frames[j][joint].x-frames[j-1][joint].x),2);
			 a = a + Math.pow((frames[j][joint].y-frames[j-1][joint].y),2);
			 sum+= Math.sqrt(a)/(skips*inputFPS);
		}
	   
		v = sum/skips;
	    start = Math.floor(index/skips) -1;
	    end = index/skips;
		data[dCount++] = [start,end,v];
		
		if (v > max)
			max = v;
		if (v <min)
			min = v;

	}

	d = max-min;
	for (i=0;i<data.length;i++)
		data[i][2]=data[i][2];

	return data;
}

function calcAccel(frames, skips, joint) {
	var data = [];
	var dCount = 0;
	var start = 1;
	var end;
	var value;
	var min = 100000;
	var max = -1;
	var vel = [];
	
	veldata = calcAveVelocities(frames, skips, joint);
	
	for (i=0;i<veldata.length;i++)
		vel[i] = veldata[i][2];
	
	for (i=1;i<vel.length;i++) {
		dv = Math.pow((vel[i]-vel[i-1]),2);
	    dt = (skips*inputFPS);
		a = dv/dt;
		
	    start = i -1;
	    end = i;
		data[dCount++] = [start,end,a];
		
		if (a > max)
			max = a;
		if (a <min)
			min = a;
	}
		
	
	d = max-min;
	for (i=0;i<data.length;i++)
		data[i][2]=data[i][2];
	
	return data;
}

function calcAveAccel(frames, skips, joint) {
	var data = [];
	var dCount = 0;
	var start = 1;
	var end;
	var value;
	var min = 100000;
	var max = -1;
	var vel = [];
	
	veldata = calcAveVelocities(frames, skips, joint);
	
	for (i=0;i<veldata.length;i++)
		vel[i] = veldata[i][2];
	
	for (i=1;i<vel.length;i++) {
		dv = Math.pow((vel[i]-vel[i-1]),2);
	    dt = (skips*inputFPS);
		a = dv/dt;
		
	    start = i -1;
	    end = i;
		data[dCount++] = [start,end,a];
		
		if (a > max)
			max = a;
		if (a <min)
			min = a;
	}
		
	
	d = max-min;
	for (i=0;i<data.length;i++)
		data[i][2]=data[i][2];
	
	return data;
}