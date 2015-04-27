var colormap = ["blue","red","yellow"];
var cmap1 = [d3.rgb(255, 237, 160) , d3.rgb(254, 178, 76), d3.rgb(240, 59, 32)];
var cmap2 = [ d3.rgb(194, 230, 153), d3.rgb(120, 198, 121), d3.rgb(49, 163, 84), d3.rgb(0, 104, 55)];

$BEAcolorScale = d3.scale.category20c();
colorbrewer2_qual = ['rgb(150,150,150)','rgb(166,206,227)','rgb(31,120,180)','rgb(178,223,138)','rgb(51,160,44)','rgb(251,154,153)','rgb(227,26,28)','rgb(253,191,111)','rgb(255,127,0)'];
colorbrewer2_seq_9_OrRd = ['rgb(255,255,204)','rgb(255,237,160)','rgb(254,217,118)','rgb(254,178,76)','rgb(253,141,60)','rgb(252,78,42)','rgb(227,26,28)','rgb(189,0,38)','rgb(128,0,38)'];
colorbrewer2_seq_9_YlOrRd = ['rgb(255,255,204)','rgb(255,237,160)','rgb(254,217,118)','rgb(254,178,76)','rgb(253,141,60)','rgb(252,78,42)','rgb(227,26,28)','rgb(189,0,38)','rgb(128,0,38)'];
colorbrewer2_seq_9_PuRd = ['rgb(247,244,249)','rgb(231,225,239)','rgb(212,185,218)','rgb(201,148,199)','rgb(223,101,176)','rgb(231,41,138)','rgb(206,18,86)','rgb(152,0,67)','rgb(103,0,31)'];

colorbrewer2_div_11_RdBu = ['rgb(103,0,31)','rgb(178,24,43)','rgb(214,96,77)','rgb(244,165,130)','rgb(253,219,199)','rgb(247,247,247)','rgb(209,229,240)','rgb(146,197,222)','rgb(67,147,195)','rgb(33,102,172)','rgb(5,48,97)'];
colorbrewer2_div_11_PuOr = ['rgb(127,59,8)','rgb(179,88,6)','rgb(224,130,20)','rgb(253,184,99)','rgb(254,224,182)','rgb(247,247,247)','rgb(216,218,235)','rgb(178,171,210)','rgb(128,115,172)','rgb(84,39,136)','rgb(45,0,75)'];
colorbrewer2_div_11_PRGn = ['rgb(64,0,75)','rgb(118,42,131)','rgb(153,112,171)','rgb(194,165,207)','rgb(231,212,232)','rgb(247,247,247)','rgb(217,240,211)','rgb(166,219,160)','rgb(90,174,97)','rgb(27,120,55)','rgb(0,68,27)'];


var f_weight = {
		label: "Weight (EXP)",
		type: "segments",
		unit: "segments",
		range: [-1,+1],
		colormap : function(v,i){
			if (i%2==0)
				return "url(#hash1)";//d3.hsl(250,1,0.5);
			else
				return "url(#hash2)";//d3.hsl(50,1,0.5);
		},
		data: [ ]
};

var f_space = {
		label: "Space (EXP)",
		type: "segments",
		unit: "segments",
		range: [-1,+1],
		colormap : function(v,i){
			if (i%2==0)
				return "url(#hash1)";//d3.hsl(250,1,0.5);
			else
				return "url(#hash2)";//d3.hsl(50,1,0.5);
		},
		data: [ ]
};

var f_time = {
		label: "Time (EXP)",
		type: "segments",
		unit: "segments",
		range: [-1,+1],
		colormap : function(v,i){
			if (i%2==0)
				return "url(#hash1)";//d3.hsl(250,1,0.5);
			else
				return "url(#hash2)";//d3.hsl(50,1,0.5);
		},		data: [ ]
};

var f_flow = {
		label: "Flow (EXP)",
		type: "segments",
		unit: "segments",
		range: [-1,+1],
		colormap : function(v,i){
			if (i%2==0)
				return "url(#hash1)";//d3.hsl(250,1,0.5);
			else
				return "url(#hash2)";//d3.hsl(50,1,0.5);
		},
		data: [ ]
};

var f_angvel = {
		label: "Speed",
		type: "cont",
		unit: "cm/s",
		range2: [50,150,250,350,450,550,650,750,850,950,1050],
		range3: [0,100,200,300,400,500,600,700,800,900],
		range: [0,10,20,30,40,50,60,70,80,90],

		rangelabels: [0,10,20,30,40,50,60,70,80,'> 900'],
		colormap : function(v){
			if (v>100) v = 100;
			if (v<0) v = 0;
			var val = Math.round(v/10);
			return colorbrewer2_seq_9_PuRd[val];
//			return d3.hsl(0,1,0.9-(v/1100));
			},
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
		range: [-100,-80,-60,-40,-20,1,20,40,60,80,100],
		rangelabels: ['<-100',-80,-60,-40,-20,0,20,40,60,80,'>100'],
		//rangelabels:['<-1000',-900,-800,-700,-600,-400,-400,-300,-200,-100,-1,1,100,200,300,400,500,600,700,800,900,'>1000'],
		//rangelabels: ['<-1000','',-800,'',-600,'',-400,'',-200,'','',0,'',200,'',400,'',600,'',800,'','>1000'],
		colormap : function(v){
			if (v>100) v = 100;
			if (v<-100) v = -100;
			var val = Math.round(v/20)+6;
			return colorbrewer2_div_11_RdBu[11-val];
			},
		colormap3 : function(v){
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
		range: [-100,-80,-60,-40,-20,1,20,40,60,80,100],
		rangelabels: ['<-100',-80,-60,-40,-20,0,20,40,60,80,'>100'],
//		range: [-1000,-900,-800,-700,-600,-500,-400,-300,-200,-100,-1,1,100,200,300,400,500,600,700,800,900,1000],
//		rangelabels: ['<-1000','',-800,'',-600,'',-400,'',-200,'','',0,'',200,'',400,'',600,'',800,'','>1000'],
		colormap : function(v){
			if (v>100) v = 100;
			if (v<-100) v = -100;
			var val = Math.round(v/20)+6;
			return colorbrewer2_div_11_PRGn[11-val];
			},
		colormap2 : function(v){
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
				return "url(#hash1)";//d3.hsl(250,1,0.5);
			else
				return "url(#hash2)";//d3.hsl(50,1,0.5);
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


var f_BEA_Ann = {
		label: "BEAs",
		type: "annot",
		unit: "Annotation",
		range: ['None','Float','Punch', 'Glide', 'Slash', 'Dab', 'Wring', 'Flick', 'Press'],
		rangelabels: ['None','Float','Punch', 'Glide', 'Slash', 'Dab', 'Wring', 'Flick', 'Press'],
		colormap : function(v,i){
			rangelabels =  ['None','Float','Punch', 'Glide', 'Slash', 'Dab', 'Wring', 'Flick', 'Press'];
			return colorbrewer2_qual[rangelabels.indexOf(v)];

		},
		data: [ ]
};

var f_SMPL_Ann = {
		label: "Sample Annotation",
		type: "annot",
		unit: "Annotation",
		range: [0,1,2,3,4,5,6,7,8],
		rangelabels: ['A','B','C', 'D', 'E', 'F', 'G', 'H', 'I'],
		colormap : function(v,i){
			return colorbrewer2_qual[v];

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

	var fps = movan.dataTracks[movan.dataTracks.length - 1].content.frameTime;

	for ( index = skips; index < frames.length; index += skips) {
		ind2 = index/skips;

//	    a = Math.pow((frames[index][joint].x-frames[index-skips][joint].x),2);
//	    a = a + Math.pow((frames[index][joint].y-frames[index-skips][joint].y),2);
//	    a = a + Math.pow((frames[index][joint].z-frames[index-skips][joint].z),2);
//	    v = Math.sqrt(a)/(skips*inputFPS);


		//v = eculDist(joint.positions[index],joint.positions[index-skips])/(skips*fps);

		v = eculDist(frames[index][joint],frames[index-skips][joint])/(skips*fps);

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
//	for (i=0;i<data.length;i++)
//		data[i][2]=data[i][2];

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

//	d = max-min;
//	for (i=0;i<data.length;i++)
//		data[i][2]=data[i][2];

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
	var fps = movan.dataTracks[movan.dataTracks.length - 1].content.frameTime;

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
	    dt = (skips*fps);
		a = dv/dt;

	    start = i -1;
	    end = i;
		data[dCount++] = [start,end,a];

		if (a > max)
			max = a;
		if (a <min)
			min = a;
	}

//	console.log(min);
//	console.log(max);

	d = max-min;
//	for (i=0;i<data.length;i++)
//		data[i][2]=data[i][2];

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
	var fps = movan.dataTracks[movan.dataTracks.length - 1].content.frameTime;

	acdata = calcAccel(frames, skips, joint);


	for (i=0;i<acdata.length;i++)
		ac[i] =simple_moving_averager(acdata[i][2],5);

	nums = [];

	for (i=1;i<ac.length;i++) {

		da = (ac[i]-ac[i-1]);
	    dt = (skips*fps);
	    jr = da/dt;

	    start = i -1;
	    end = i;
		data[dCount++] = [start,end,jr];

		if (jr > max)
			max = jr;
		if (jr <min)
			min = jr;
	}


    //console.log(data);


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


function cluster (data_) {
	//console.log(data_);
	var data2 = [];
	var start = 0;
	var end = start;
	var lastSeen = data_[0];
	dCount = 0;
	for (i=1;i<data_.length;i++) {
		if (data_[i]!=lastSeen) {
			end = i;
			data2[dCount++] = [start,end,lastSeen];
			start = end;
		}
		lastSeen = data_[i];
	}

	if (end<i-1) {
		end = i-1;
		data2[dCount++] = [start,end,lastSeen];
	}

	//console.log(data2);
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

function calcSpace_K (frames, skips, joint) {
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

		var k = index;

		for (i = skips;i<k-skips;i+=skips) {

		//
		var sum = 0;
		for (j = i;j<=k;j+=skips) {
			sum += eculDist(frames[k][joint],frames[j][joint]);
		}

		totalDist = eculDist(frames[k][joint],frames[i][joint]);


		var frac = sum/totalDist;

		temp[k/skips][i] = frac;
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
	var T_max = 6800;
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

			dv = (Math.abs(vel[k])-Math.abs(vel[i]));
		    dt = (skips*movan.inputFPS);
			a = dv/dt;
			a = Math.abs(a-T_max);
			temp[index/skips][i] = a;

			if (a < min) {
				min = a;
				minIndex = i;
			}
		}

		data[dCount++] = minIndex;


	}


//
//	console.log(temp);
//	console.log(data);
//	console.log(cluster(data));
	return cluster(data);

}

function calcTime_K (frames, skips, joint) {
	var data = [];
	var dCount = 0;
	var start = 1;
	var end;
	var value;
	var min = 100000;
	var minIndex = -1;
	var max = -1;
	var fracs = [];
	var T_max = 20000;
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
			var sum = 0;
			for (j = i+1;j<=k;j++) {
				dv = (Math.abs(vel[j]-vel[j-1]));
		   		 dt = (skips*movan.inputFPS);
				a = dv/dt;
				sum += a;
			}
			temp[index/skips][i] = sum;
			a = Math.abs(sum-T_max);


			if (a < min) {
				min = a;
				minIndex = i;
			}
		}

		data[dCount++] = minIndex;


	}


//
	console.log("Time data:");
	console.log(data);
//	console.log(data);
//	console.log(cluster(data));
	return cluster(data);

}

function calcFlow_K (frames, skips, joint) {
	var data = [];
	var dCount = 0;
	var start = 1;
	var end;
	var value;
	var min = 100000;
	var minIndex = -1;
	var max = -1;
	var fracs = [];
	var T_max = 1000;
	var acc = [];


	var temp = new Array(Math.floor(frames.length/skips));

	accdata = calcAccel(frames, skips, joint);

	for (i=0;i<accdata.length;i++)
		acc[i] = accdata[i][2];

	nums = [];
	acc = acc.map(function(d) {
		return simple_moving_averager(d, 5);
	});
	nums = [];


	for (k=1;k<acc.length;k++) {
	min = 1000000000;
		temp[index/skips] = new Array(Math.floor(frames.length/skips));

		for (i = 0;i<k;i++) {
			var sum = 0;
			for (j = i+1;j<=k;j++) {
				da = (Math.abs(acc[j]-acc[j-1]));
		   		 dt = (skips*movan.inputFPS);
				jerk = dv/dt;
				sum += jerk;
			}
			temp[index/skips][i] = sum;
			value = Math.abs(sum-T_max);


			if (value < min) {
				min = value;
				minIndex = i;
			}
		}
		data[dCount++] = minIndex;


	}


//
//	console.log(temp);
//	console.log(data);
//	console.log(cluster(data));
	return cluster(data);

}

function readAnn (frames, skips, filename) {
	var data = [];
	var dCount = 0;
	var ann = 0;

	var rnd_window_size = Math.floor(frames.length/(skips*8));
	console.log(rnd_window_size);

	for ( index = 0; index <frames.length; index += skips) {
		data[dCount++] = ann;
		if(dCount % rnd_window_size == 0 )
			ann++;
		if (ann>7) ann =0;
	}
//	console.log(data);
	return cluster(data);
}

function readAnn2 (frames, skips, joint, filename) {
	var data = [];
	var dCount = 0;
	var framelength = 1.0/120.0 * 1000; //framelength in milliseconds

	var unparsedAnn  = "0.0 8266.57 None\n";
		unparsedAnn += "8266.57 12640.4 Float\n";
		unparsedAnn += "12640.4 14040.0 Punch\n";
		unparsedAnn += "14040.0 17976.5 Glide\n";
		unparsedAnn += "17976.5 19070.0 Slash\n";
		unparsedAnn += "19070.0 20119.7 Dab\n";
		unparsedAnn += "20119.7 23837.5 Wring\n";
		unparsedAnn += "23837.5 24887.2 Flick\n";
		unparsedAnn += "24887.2 30835.6 Press\n";
		unparsedAnn += "30835.6 33136.0 None\n";

	var data = d3.dsv(" ").parseRows(unparsedAnn);

	// put joints together
	annotes = data.map(function(d) {
		var ann = [];
		ann.start = d[0];
		ann.end = d[1];
		ann.label = d[2];

		return ann;
	});

	var annotes_frame = [];

	for (i=0; i<annotes.length; i++) {
		annotes_frame[i] = [];
		annotes_frame[i][0] = Math.round((annotes[i].start / framelength)/skips);
		annotes_frame[i][1] = Math.round((annotes[i].end / framelength)/skips);
		annotes_frame[i][2] = annotes[i].label;
	}
	console.log(annotes);
	console.log(annotes_frame);
	return annotes_frame;
}
