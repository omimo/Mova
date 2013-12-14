var colormap = ["blue","red","yellow"];
var cmap1 = [d3.rgb(255, 237, 160) , d3.rgb(254, 178, 76), d3.rgb(240, 59, 32)];
var cmap2 = [ d3.rgb(194, 230, 153), d3.rgb(120, 198, 121), d3.rgb(49, 163, 84), d3.rgb(0, 104, 55)];

var f_weight = {
		label: "Weight (Kap)",
		type: "segments",
		unit: "segments",
		range: [-1,+1],
		colormap : function(v,i){
//			return d3.hsl(50,0.9,0.5);
			if (i%2==0)
				return d3.hsl(250,1,0.5);
			else
				return d3.hsl(50,1,0.5);
		},
		data: [ ]
};

var f_space = {
		label: "Space (Kap)",
		type: "segments",
		unit: "segments",
		range: [-1,+1],
		colormap : function(v,i){
//			return d3.hsl(50,0.9,0.5);
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
		unit: "segments",
		range: [-1,+1],
		colormap :function(v){return cmap2[v];},
		data: [ ]
};

var f_flow = {
		label: "Flow",
		type: "segments",
		unit: "segments",
		range: [-1,+1],
//		colormap : [d3.rgb(255, 255, 204), d3.rgb(194, 230, 153), d3.rgb(120, 198, 121), d3.rgb(49, 163, 84), d3.rgb(0, 104, 55)],
		colormap : function(v){return cmap1[v];},
		data: [ ]
};

var f_angvel = {
		label: "Velocity",
		type: "cont",
		unit: "cm/s",
		range: [0,100,200,300,400,500,600,700,800,900,1000],
		rangelabels: [0,100,200,300,400,500,600,700,800,900,1000],
		colormap : function(v){return d3.hsl(0,1,0.9-(v/1100));},
		data: [ ]
};

var f_aveangvel = {
		label: "AveVelocity",
		type: "cont",
		unit: "cm/s",
		range: [0,100,200,300,400,500,600,700,800,900,1000],
		rangelabels: [0,100,200,300,400,500,600,700,800,900,1000],
		colormap : function(v){if (v>1000) v = 1000;return d3.hsl(0,1,0.9-(v/1100));},
		data: [ ]
};

var f_accel = {
		label: "Acceleration",
		type: "bipolar",
		unit: "cm/s^2",
		range: [-1000,-900,-800,-700,-600,-400,-400,-300,-200,-100,-1,1,100,200,300,400,500,600,700,800,900,1000],
		rangelabels:['<-1000',-900,-800,-700,-600,-400,-400,-300,-200,-100,-1,1,100,200,300,400,500,600,700,800,900,'>1000'],
		colormap : function(v){
			if (v>1000) v = 1000;
			if (v<-1000) v = -1000;
		
			if (v>0)
				return d3.hsl(15,1,0.9-(v/1200));
			else
				return d3.hsl(208,1,0.9-(-v/1200));
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


var f_jerk = {
		label: "Jerk",
		type: "bipolar",
		unit: "cm/s^3",
		range: [-1000,-900,-800,-700,-600,-500,-400,-300,-200,-100,-1,1,100,200,300,400,500,600,700,800,900,1000],
		rangelabels: ['<-1000','',-800,'',-600,'',-400,'',-200,'','',0,'',200,'',400,'',600,'',800,'','>1000'],
		colormap : function(v){
			if (v>1000) v = 1000;
			if (v<-1000) v = -1000;
		
			if (v>0)
				return d3.hsl(45,1,0.9-(v/1200));
			else
				return d3.hsl(145,1,0.9-(-v/1200));
			},
		data: [ ]
};


var f_directseg = {
		label: "Direct Segments",
		type: "segments",
		unit: "segments",
		range: [-1,+1],
		rangelabels: [-1,+1],
		colormap : function(v,i){
			if (i%2==0)
				return d3.hsl(250,1,0.5);
			else
				return d3.hsl(50,1,0.5);
		},
		data: [ ]
};

var f_overhips = {
		label: "Joint Over Hips",
		type: "annot",
		unit: "Annotation",
		range: [-1,+1],
		rangelabels: ['below','over'],
		colormap : function(v,i){
			if (v>=0)
				return d3.hsl(250,1,0.5);
			else
				return d3.hsl(50,1,0.5);
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
		
		
		
		v = eculDist(frames[index][joint],frames[index-skips][joint])/(skips*movan.inputFPS);
		
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
			
			sum+= eculDist(frames[j][joint],frames[j-1][joint])/(movan.inputFPS);

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
	
	veldata = calcVelocities(frames, skips, joint);
	
	for (i=0;i<veldata.length;i++)
		vel[i] = veldata[i][2];

	nums = [];
	vel = vel.map(function(d) {
		return simple_moving_averager(d, 5);
	});
	nums = [];

	
	for (i=1;i<vel.length;i++) {
		dv = Math.pow((vel[i]-vel[i-1]),2);
		dv = (vel[i]-vel[i-1]);
	    dt = (skips*movan.inputFPS);
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

function calcJerk(frames, skips, joint) {
	var data = [];
	var dCount = 0;
	var start = 1;
	var end;
	var value;
	var min = 100000;
	var max = -1;
	var ac = [];
	
	acdata = calcAccel(frames, skips, joint);
	
	
	for (i=0;i<acdata.length;i++)
		ac[i] =simple_moving_averager(acdata[i][2],5);
	
	nums = [];
	
	for (i=1;i<ac.length;i++) {
		
		da = (ac[i]-ac[i-1]);
	    dt = (skips*movan.inputFPS);
	    jr = da/dt;
		
	    start = i -1;
	    end = i;
		data[dCount++] = [start,end,jr];
		
		if (jr > max)
			max = jr;
		if (jr <min)
			min = jr;
	}


console.log(data);

	
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
	var T = 0.8;
		
	var temp = new Array(Math.floor(frames.length/skips));
	
	
	for ( index = 0; index <frames.length; index += skips) {
		
		var min = 100000;
		temp[index/skips] = new Array(Math.floor(frames.length/skips));
		
		
		for (i = skips;i<index-skips;i+=skips) {
			
		//
		var sum = 0;
		for (j = i;j<=index;j+=skips) {
			sum += eculDist(frames[index][joint],frames[j][joint]);
		}
		
		totalDist = eculDist(frames[index][joint],frames[i][joint]);
		
	
		var frac = sum/totalDist;
		
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
	//console.log(temp);
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
	var T = 0.6;
		
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
		frac2 = Math.abs(frac - T);
		temp[index/skips][i] = frac2;
		//console.log(index+","+i+","+frac);
		
		if (frac2 < min) {
			min = frac2;
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

function calcSpace_Pathway_Omid	 (frames, skips, joint) {
	var data = [];
	var dCount = 0;
	var start = 1;
	var end;
	var value;
	var min = 100000;
	var minIndex = -1;
	var max = -1;
	var fracs = [];
	var T = 0.8;
		
	var temp = new Array(Math.floor(frames.length/skips));
	
	
	for ( index = 0; index <frames.length; index += skips) {
		
		var min = 100000;
		temp[index/skips] = new Array(Math.floor(frames.length/skips));
		
		
		for (i = skips;i<index-skips;i+=skips) {
			
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
	//console.log(temp);
//	console.log(data);
//	console.log(cluster(data));
	return cluster(data);
}

function calcSpace_Pathway_Omid2(frames, skips, joint) {
    var data = [];
    var dCount = 0;
    var start = 1;
    var end;
    var value;
    var min = 100000;
    var minIndex = -1;
    var max = -1;
    var fracs = [];
    var dx = 0.2;
    
    var temp = new Array(Math.floor(frames.length/skips));
    
    
    //for ( index = Math.floor(frames.length/skips)*skips-skips; index >=0; index -= skips) {
    index = Math.floor(frames.length/skips)*skips-skips;
    while (index>=0) {
            var next = 0;
            
            var min = 100000;
            temp[index/skips] = new Array(Math.floor(frames.length/skips));
            
            
            for (i = index-skips;i>=0;i-=skips) {
            //
            var sum = 0;
            for (j = i+skips;j<=index;j+=skips) {
                    sum += eculDist(frames[j-skips][joint],frames[j][joint]);
            }
            
            totalDist = eculDist(frames[index][joint],frames[i][joint]);
            
    
            var frac = totalDist/sum;

            temp[index/skips][i] = frac;
            //if ( Math.abs(frac - temp[index/skips][i+skips]) >  dx)
            if ( Math.abs(frac - 1) >  dx)
            {
                    
                    minIndex = i;
//                    index = i - skips;
//                    next = 1;
//                    break;
            }
    
            //minIndex = i;
    }
//            if (next==1) {
//            
//                    next = 0;
//                    continue;
//            }
    
            index = i - skips;
            data[dCount++] = minIndex;
    }


//
    console.log(data);
    console.log(cluster2(data));
//    console.log(data);
//    console.log(cluster(data));
    return cluster2(data);

}

function calcJoHips (frames, skips, joint, hipj) {
	var data = [];
	var dCount = 0;

	for ( index = 0; index <frames.length; index += skips) {
		
		if (frames[index][joint].y > frames[index][hipj].y)
			data[dCount++] = 1;
		else
			data[dCount++] = -1;
	}
		
	
	return cluster(data);

}


function cluster (data) {
	var data2 = [];
	var start = 0;
	var end = start;
	var lastSeen = data[0];
	dCount = 0;
	for (i=1;i<data.length;i++) {
		if (data[i]!=lastSeen) {
			end = i-1;
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

function cluster2 (data) {
	var data2 = [];
	var end = data.length-1;
	var lastSeen = data[end];
    var start = end;
	dCount = 0;
	for (i=data.length-2;i>=0;i--) {
		if (data[i]!=lastSeen) {
			start = i;
			data2[dCount++] = [start,end,lastSeen];
			end = start-1;
		}
		lastSeen = data[i];
	}
	
	if (start!=0) {
		start = 0;
		data2[dCount++] = [start,end,lastSeen];
	}
		
	return data2;
}

var nums = [];

function simple_moving_averager(num, period) {
   
    
	nums.push(num);
        if (nums.length > period)
            nums.splice(0,1);  // remove the first element of the array
        var sum = 0;
        for (var i in nums)
            sum += nums[i];
        var n = period;
        if (nums.length < period)
            n = nums.length;
        return(sum/n);
    
}

function calcWeight_K (frames, skips, joint) {
	var data = [];
	var dCount = 0;
	var start = 1;
	var end;
	var value;
	var min = 1000000000;
	var minIndex = -1;
	var max = -1;
	var fracs = [];
	var T = 6800;
	var vel = [];
	
	var temp = new Array(Math.floor(frames.length/skips));
	
	veldata = calcVelocities(frames, skips, joint);
	
	for (i=0;i<veldata.length;i++)
		vel[i] = veldata[i][2];

	nums = [];
	vel = vel.map(function(d) {
		return simple_moving_averager(d, 5);
	});	
	nums = [];

	
	for (k=1;k<vel.length;k++) {
		min = 1000000000;
		 temp[index/skips] = new Array(Math.floor(frames.length/skips));
		for (i = 0;i<k;i++) {
			
			dv = (vel[k]-vel[i]);
		    dt = (skips*movan.inputFPS);
			a = dv/dt;
			temp[index/skips][i] = a;
			a = Math.abs(a-T);
			
			if (a < min) {
				min = a;
				minIndex = i;
			}
		}
		
		data[dCount++] = minIndex;
		
		
	}

	
	

//
	console.log(temp);
//	console.log(data);
//	console.log(cluster(data));
	return cluster(data);

}