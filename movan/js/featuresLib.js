var colormap = ["blue","red","yellow"];
var cmap1 = [d3.rgb(255, 237, 160) , d3.rgb(254, 178, 76), d3.rgb(240, 59, 32)];
var cmap2 = [ d3.rgb(194, 230, 153), d3.rgb(120, 198, 121), d3.rgb(49, 163, 84), d3.rgb(0, 104, 55)];

var f_weight = {
		label: "Weight",
		type: "segments",
		unit: "",
		range: [-1,+1],
		colormap : function(v){return cmap1[v];},
		data: [ ]
};

var f_space = {
		label: "Space (Pathway)",
		type: "segments",
		unit: "",
		range: [-1,+1],
		colormap : function(v,i){
			if (i%2==0)
				return d3.hsl(250,1,0.5);
			else
				return d3.hsl(50,1,0.5);
		},
		data: [ ]
};

var f_time = {
		label: "Time",
		type: "segments",
		unit: "",
		range: [-1,+1],
		colormap :function(v){return cmap2[v];},
		data: [ ]
};

var f_flow = {
		label: "Flow",
		type: "segments",
		unit: "",
		range: [-1,+1],
//		colormap : [d3.rgb(255, 255, 204), d3.rgb(194, 230, 153), d3.rgb(120, 198, 121), d3.rgb(49, 163, 84), d3.rgb(0, 104, 55)],
		colormap : function(v){return cmap1[v];},
		data: [ ]
};

var f_angvel = {
		label: "Velocity",
		type: "cont",
		unit: "pixels/s",
		range: [0,100,200,300,400,500,600,700,800,900,1000],
		colormap : function(v){return d3.hsl(0,1,0.9-(v/1100));},
		data: [ ]
};

var f_aveangvel = {
		label: "AveVelocity",
		type: "cont",
		unit: "pixels/s",
		range: [0,100,200,300,400,500,600,700,800,900,1000],
		colormap : function(v){if (v>1000) v = 1000;return d3.hsl(0,1,0.9-(v/1100));},
		data: [ ]
};

var f_accel = {
		label: "Acceleration",
		type: "bipolar",
		unit: "pixels/s^2",
		range: [-200,-180,-160,-140,-120,-100,-80,-60,-40,-20,-1,1,20,40,60,80,100,120,140,160,180,200],
		colormap : function(v){
			if (v>200) v = 200;
			if (v<-200) v = -200;
		
			if (v>0)
				return d3.hsl(15,1,0.9-(v/200));
			else
				return d3.hsl(208,1,0.9-(-v/200));
			},
		colormap2 : function(v){
//				if (v>165) v = 165;
//				if (v<-165) v = -165;
//				v +=165;
//				return d3.hsl(v,1,0.5);
			v = v/50;
			if (v>100) v = 100;
			if (v<-100) v = -100;
			v +=100;
			if (v> 100) 
				return d3.hsl(2,1,1-v/200);
			else  
				return d3.hsl(227,1,1-v/200);
		//	return d3.hsl(v,1,0.5);
			
				//return d3.hsl((Math.abs(v)+180)/360,1,0.5);
				},		
		data: [ ]
};



function makeRandomFeature(frames, skips) {
	var data = [];
	var dCount = 0;
	var start = 0;
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


function eculDist (pos1,pos2) {
	var a = 0;
	 a = Math.pow((pos1.x-pos2.x),2);
	 a = a + Math.pow((pos1.y-pos2.y),2);
	 a = a + Math.pow((pos1.z-pos2.z),2);
	 return  Math.sqrt(a);
}

function calcVelocities(frames, skips, joint) {
	var data = [];
	var dCount = 0;
	var start = 0;
	var end;
	var value;
	var min = 100000;
	var max = -1;

	for ( index = skips; index < frames.length; index += skips) {
		ind2 = index/skips;
		
//	    a = Math.pow((frames[index][joint].x-frames[index-skips][joint].x),2);
//	    a = a + Math.pow((frames[index][joint].y-frames[index-skips][joint].y),2);
//	    a = a + Math.pow((frames[index][joint].z-frames[index-skips][joint].z),2);
//	    v = Math.sqrt(a)/(skips*inputFPS);
		
		v = eculDist(frames[index][joint],frames[index-skips][joint])/(skips*inputFPS);
		
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
		for (j=index-skips+1;j<=index;j++) {
			
//			 a = Math.pow((frames[j][joint].x-frames[j-1][joint].x),2);
//			 a = a + Math.pow((frames[j][joint].y-frames[j-1][joint].y),2);
//			 a = a + Math.pow((frames[index][joint].z-frames[index-skips][joint].z),2);
//			 sum+= Math.sqrt(a)/(skips*inputFPS);
			
			sum+= eculDist(frames[j][joint],frames[j-1][joint])/(skips*inputFPS);

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
		dv = (vel[i]-vel[i-1]);
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
	console.log(min);
	console.log(max);
	
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


function calcSpace_Pathway (frames, skips, joint) {
	var data = [];
	var dCount = 0;
	var start = 1;
	var end;
	var value;
	var min = 100000;
	var minIndex = -1;
	var max = -1;
	var fracs = [];
	
	var temp = new Array(Math.floor(frames.length/skips));
	
	
	for ( index = 0; index <frames.length; index += skips) {
		
		var min = 100000;
		temp[index/skips] = new Array(Math.floor(frames.length/skips));
		
		
		for (i = 0;i<index;i+=skips) {
			
		//
		var sum = 0;
		for (j = i+skips;j<=index;j+=skips) {
			sum += eculDist(frames[j-skips][joint],frames[j][joint]);
		}
		
		totalDist = eculDist(frames[index][joint],frames[i][joint]);
		
	
		var frac = totalDist/sum;
		temp[index/skips][i] = frac;
		//console.log(index+","+i+","+frac);
		if (frac < min) {
			min = frac;
			minIndex = i;
		}
		//	
	}
		
	
		data[dCount++] = minIndex;
	}
    

//
//	console.log(temp);
//	console.log(data);
//	console.log(cluster(data));
	return cluster(data);

}

function calcSpace_Pathway_Cont	 (frames, skips, joint) {
	var data = [];
	var dCount = 0;
	var start = 1;
	var end;
	var value;
	var min = 100000;
	var minIndex = -1;
	var max = -1;
	var fracs = [];
	
	var temp = new Array(Math.floor(frames.length/skips));
	
	
	for ( index = 0; index <frames.length; index += skips) {
		
		var min = 100000;
		temp[index/skips] = new Array(Math.floor(frames.length/skips));
		
		
		for (i = 0;i<index;i+=skips) {
			
		//
		var sum = 0;
		for (j = i+skips;j<=index;j+=skips) {
			sum += eculDist(frames[j-skips][joint],frames[j][joint]);
		}
		
		totalDist = eculDist(frames[index][joint],frames[i][joint]);
		
	
		var frac = totalDist/sum;
		temp[index/skips][i] = frac;
		//console.log(index+","+i+","+frac);
		if (frac < min) {
			min = frac;
			minIndex = i;
		}
		//	
	}
		
	
		data[dCount++] = minIndex;
	}
    

//
//	console.log(temp);
//	console.log(data);
//	console.log(cluster(data));
	return cluster(data);

}

function cluster (data) {
	var data2 = [];
	var start = 0;
	var lastSeen = data[0];
	dCount = 0;
	for (i=1;i<data.length;i++) {
		if (data[i]!=lastSeen) {
			end = i;
			data2[dCount++] = [start,end,lastSeen];
			start = end;
		}
		lastSeen = data[i];
	}
	
	if (end!=i-1) {
		end = i-1;
		data2[dCount++] = [start,end,lastSeen];
	}
		
	return data2;
}