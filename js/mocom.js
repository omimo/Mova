// initialized by Sunny at Nov 26, 2015

// bodyparts
var LEFTARM		= 0;
var RIGHTARM	= 1;
var LEFTLEG		= 2;
var RIGHTLEG	= 3;
var CENTER		= 4;

// joints index
// left arm
var L_SHOULDER	= 5;
var L_ELBLOW	= 6;
var L_WRIST		= 7;
var L_PALM		= 10;
// right arm
var R_SHOULDER	= 13;
var R_ELBLOW	= 14;
var R_WRIST		= 15;
var R_PALM		= 18;
// left leg
var L_HIP		= 20;
var L_KNEE		= 21;
var L_ANKLE		= 22;
var L_FOOT		= 23;
// right leg
var R_HIP		= 25;
var R_KNEE		= 26;
var R_ANKLE		= 27;
var R_FOOT		= 28;
// conter
var C_HIP		= 0;
var SPINE		= 1;
var C_SHOULDER	= 4;
var HEAD		= 2;


var mocom = {

/**
takeAAngles and takeBAngles format:
takeAAngles = [
joint0[frame0{alpha, beta}, frame1{alpha, beta}..........]
joint1[frame0{alpha, beta}, frame1{alpha, beta}..........]
joint2[frame0{alpha, beta}, frame1{alpha, beta}..........]
]

takeAPos and takeBPos format:
takeAPos = [
joint0[frame0[[x,y,z],[x,y,z]], frame1[[x,y,z],[x,y,z]]......]
joint1[frame0[[x,y,z],[x,y,z]], frame1[[x,y,z],[x,y,z]]......]
joint2[frame0[[x,y,z],[x,y,z]], frame1[[x,y,z],[x,y,z]]......]
joint3[frame0[[x,y,z],[x,y,z]], frame1[[x,y,z],[x,y,z]]......]
joint4[frame0[[x,y,z],[x,y,z]], frame1[[x,y,z],[x,y,z]]......]
joint5[frame0[[x,y,z],[x,y,z]], frame1[[x,y,z],[x,y,z]]......]
]
**/
	takeAAngles : [],

	takeBAngles : [],
	
	takeAPos : [],
	
	takeBPos : [],
		
	neededJoint : [],

	/**
	 * get positions and calculate angles
	 * TakeAPosition[
	 * 	jointArray1[{x:0, y:0, z:0},{},{},...],     "Root" joint (center shoulder or center hip
	 * 	jointArray2[{x:0, y:0, z:0},{},{},...],		Spine joint
	 * 	jointArray3[{x:0, y:0, z:0},{},{},...],		"Connecting" joint/body part joint 1 (joint that connects body part to core, right/left shoulder or hip
	 * 	jointArray4[{x:0, y:0, z:0},{},{},...],		Body part joint 2 (elbow or knee)
	 * 	jointArray5[{x:0, y:0, z:0},{},{},...],		Body part joint 3 (wrist or ankle)
	 * 	jointArray6[{x:0, y:0, z:0},{},{},...]		Body part joint 4 (hand or foot)
	 * ]
	 **/
	prepareMocom : function(){
		// show loader
		$("#visCont .loaderWrap").remove();
		$("#visCont")
		.append('<div class="loaderWrap"><img class="loader" src="../img/loader.gif"></div>')
		.css("display", "block");
		var takeLoadCnt = 0;

		// get from gui
		var urlA = document.getElementById("sltURLA").value;
		var urlB = document.getElementById("sltURLB").value;
		var starttimeA = document.getElementById("takeStartTimeA").value/1000;
		var starttimeB = document.getElementById("takeStartTimeB").value/1000;
		var duration = document.getElementById("duration").value/1000;
		var bodypart = parseInt($("#bodypart").find(":selected").attr("data-bodypart"));

		var takeAPosition = [];
		var takeBPosition = [];
		switch( parseInt($("#bodypart").find(":selected").attr("data-bodypart")) ){
			case LEFTARM :
			mocom.neededJoint = [C_SHOULDER, SPINE, L_SHOULDER, L_ELBLOW, L_WRIST, L_PALM];
			break;

			case RIGHTARM : 
			mocom.neededJoint = [C_SHOULDER, SPINE, R_SHOULDER, R_ELBLOW, R_WRIST, R_PALM];
			break;

			case LEFTLEG :
			mocom.neededJoint = [C_HIP, SPINE, L_HIP, L_KNEE, L_ANKLE, L_FOOT];
			break;

			case RIGHTLEG :
			mocom.neededJoint = [C_HIP, SPINE, R_HIP, R_KNEE, R_ANKLE, R_FOOT];
			break;

			case SPINE :
			mocom.neededJoint = [C_HIP, SPINE, C_SHOULDER, HEAD];
			break;

			default:
			mocom.neededJoint = [];
		}

		// clear up the dataTracks and load our track to it.
		movan.dataTracks = [];
		fileHandler.loadDataTrack(urlA, function(dataTrack, t){
			movan.dataTracks.push({content: dataTrack, type: t});

			// get the start frame index, length
			// different framerates (of takeA and takeB) might cause proublem later, but since we mostly consider takes in a same project so we ignore it for now.
			var frameTimeA = movan.dataTracks[0].content.frameTime;
			var lastFrameA = movan.dataTracks[0].content.frameCount;
			var startFrameA = Math.floor(starttimeA / frameTimeA);
			var endFrameA = startFrameA + Math.floor(duration / frameTimeA);
			if(startFrameA >= lastFrameA || startFrameA < 0){
				alert("Oops! Your start time is outside the sequence duration. Please change it and try again.");
				return;
			}
			if(endFrameA >= lastFrameA){
				alert("Oops! Your duration extends outside the sequence duration. Please change it and try again.");
				return;
			}
			
			for (var j=0; j<6; j++){
				takeAPosition[j] = [];
				for (var i=startFrameA; i<endFrameA; i++){
					var tmp = [];
					tmp = movan.dataTracks[0].content.jointArray[ mocom.neededJoint[j] ].positions[i]; 
					takeAPosition[j].push(tmp);
				}
			}
			var takeAData = mocom.angleData.convertData(takeAPosition);
			mocom.takeAAngles = takeAData[0];
			mocom.takeAPos = takeAData[1];

			takeLoadCnt++;
			if(takeLoadCnt>=2){
				$("#visCont .loaderWrap").remove();
				mocom.createVis();
			}
		});
		
		fileHandler.loadDataTrack(urlB, function(dataTrack, t){
			movan.dataTracks.push({content: dataTrack, type: t});

			var frameTimeB = movan.dataTracks[1].content.frameTime;
			var lastFrameB = movan.dataTracks[1].content.frameCount;
			var startFrameB = Math.floor(starttimeB / frameTimeB);
			var endFrameB = startFrameB + Math.floor(duration / frameTimeB);
			if(startFrameB >= lastFrameB || startFrameB < 0){
				alert("Oops! Your start time is outside the sequence duration. Please change it and try again.");
				return;
			}
			if(endFrameB >= lastFrameB){
				alert("Oops! Your duration extends outside the sequence duration. Please change it and try again.");
				return;
			}

			for (var j=0; j<6; j++){
				takeBPosition[j] = [];
				for (var i=startFrameB; i<endFrameB; i++){
					var tmp = [];
					tmp = movan.dataTracks[1].content.jointArray[ mocom.neededJoint[j] ].positions[i]; 
					takeBPosition[j].push(tmp);
				}
			}
			var takeBData = mocom.angleData.convertData(takeBPosition);
			mocom.takeBAngles = takeBData[0];
			mocom.takeBPos = takeBData[1];

			takeLoadCnt++;
			if(takeLoadCnt>=2){
				$("#visCont .loaderWrap").remove();
				mocom.createVis();
			}
		});
		
	},

	createVis : function(){
		var frameCount = mocom.takeAAngles[0].length; // total frames of all this comparison
		var brushStartFrame = 0;
		var brushEndFrame = frameCount-1;
		mocom.createOverview();
		mocom.createMultiples(0, frameCount-1);
		mocom.createInstView(0);

		// get the brusher container (overview)
		var overviewCont = d3.select("#visOverview");

		// create the dragable brusher
		var width = 1086;
		var height = 180;
		var xScale = d3.scale.linear()
			.domain([0,frameCount-1])
		    .range([0, width]);
		var brush = d3.svg.brush()
			.x(xScale)
			.extent([.3, .5])
			.on("brushstart", brushstart)
			.on("brush", brushmove)
			.on("brushend", brushend);
		var brusher = overviewCont.append("svg")
			.classed("brusherWrap", true)
		    .attr("width", width)
		    .attr("height", height)
			.append("g")
		    .attr("class", "brusher")
		    .call(brush);
		brusher.selectAll("rect")
		    .attr("height", height);
		
		// set callback functions
		function brushstart(){
		};
		function brushend(){
		};
		function brushmove(){
			var s = brush.extent();
			brushStartFrame = 0;
			brushEndFrame = frameCount-1;
			if(Math.round(s[0])!=Math.round(s[1])){
				brushStartFrame = Math.round(s[0]);
				brushEndFrame = Math.round(s[1]);
			}
			console.log(brushStartFrame + ", " + brushEndFrame);
			mocom.createMultiples(brushStartFrame, brushEndFrame);
			updateScale();
		};
		
		//MOUSE OVER HIGHLIGHTER
		var xScaleFocus = d3.scale.linear()
			.domain([brushStartFrame,brushEndFrame])
		    .range([0, 289]);
		var focusFrame = brushStartFrame;
		//Get all multiples svgs
		var multiples = d3.selectAll(".smallMultiple");
		//Draw a responsive overlay
		var activeArea = multiples.append("svg")
			.attr("class", "highlightWrapper");			
		//Add a line to them
		activeArea.append("line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 0)
			.attr("y2", 64)
			.attr("class", "highlightLine")
			.attr("style", "display: none;");
		//Add listeners
		activeArea.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseout", mouseout);
		function mouseover(){
			d3.selectAll(".highlightLine")	
				.attr("style", "display: inline;");
			focusFrame = Math.round(xScaleFocus.invert(d3.mouse(this)[0]));
			mocom.createInstView(focusFrame);
			console.log(focusFrame);
		};
		function mousemove(){
			d3.selectAll(".highlightLine")		
				.attr("x1", d3.mouse(this)[0])
				.attr("y1", 0)
				.attr("x2", d3.mouse(this)[0])
				.attr("y2", 64)
			focusFrame = Math.round(xScaleFocus.invert(d3.mouse(this)[0]));
			mocom.createInstView(focusFrame);
			console.log(focusFrame);
		};
		function mouseout(){
			d3.selectAll(".highlightLine")
				.attr("style", "display: none;");
		};
		function updateScale(){
			xScaleFocus.domain([brushStartFrame,brushEndFrame]);
		};
	},

	createOverview : function(){
		var dataP1 = [];
		var dataP2 = [];
		for(var i=0; i < mocom.takeAAngles.length; i++){
			dataP1[i] = [];
			dataP2[i] = [];
			for(var j=0; j < mocom.takeAAngles[0].length; j++){
				dataP1[i][j] = mocom.takeAAngles[i][j].alpha - mocom.takeBAngles[i][j].alpha;
				dataP2[i][j] = mocom.takeAAngles[i][j].beta - mocom.takeBAngles[i][j].beta;
			}
		}
		//NNED TO ADD FUNCTION TO CHECK WHICH TAKE OVER WHICH TO DETERMINE COLOR
		var color = ["#bfd0ff", "#ddff33", "#14dba4"];
				
		//Find the x-scale based on number of frames
		var xScale = d3.scale.linear()
								.domain([0, mocom.takeAAngles[0].length])
								.range([5, 1095]);
		//Find the y-scale based on maximum sum of the values of the data
		var k = 0;
		var totalY = [];
		for(var j=0; j<dataP1[0].length; j++, k++) {
			totalY[k] = 0;
			for(var i=0; i<dataP1.length; i++) {
				totalY[k] += Math.abs(dataP1[i][j]);
			}
		}
		for(var j=0; j<dataP1[0].length; j++, k++) {
			totalY[k] = 0;
			for(var i=0; i<dataP2.length; i++) {
				totalY[k] += Math.abs(dataP2[i][j]);
			}
		}
		var yScale = d3.scale.linear()
								.domain([0, d3.max(totalY)]) 
								.range([4, 66]);
				
	/*		//Create x-axis
			var xAxis = d3.svg.axis()
								.scale(xScale);

			var xAxisGroup = overviewContainer.append("g")
												.attr("class", "overviewAxis") 
												.call(xAxis);
			*/
			//Data needs to have properties x and y to parse
		dataP1 = dataP1.map(function (d) {
							return d.map(function (d, index) {
									return {
											x: index,
											y: Math.abs(d),
											y0: 0
											};
									});
						});
		dataP2 = dataP2.map(function (d) {
							return d.map(function (d, index) {
									return {
											x: index,
											y: Math.abs(d),
											y0: 0
											};
									});
						});
											
		var newStack = d3.layout.stack().offset("silhouette");
		var streams1 = newStack(dataP1);
		var streams2 = newStack(dataP2);
				
		var area = d3.svg.area() 
							.x(function (d) {
								return xScale(d.x);
								})
							.y0(function (d) {
								return yScale(d.y0);
								})
							.y1(function (d) {
								return yScale(d.y0 + d.y);
								});
		//Creates the container for overview visualization
		var overviewP1 = d3.selectAll("#visOverviewChartP1")
									.append("svg")
										.attr("width", 1100)
										.attr("height", 70);
		var overviewP2 = d3.select("#visOverviewChartP2")
									.append("svg")
										.attr("width", 1100)
										.attr("height", 70);

		overviewP1.selectAll(".stream")
							.data(streams1)
							.enter()
								.append("path")
									.attr("class", "stream")
									.attr("d", function (d) {
												return area(d);
												})
									.style("fill", function (d, i) {
												return color[i];
												});
		overviewP2.selectAll(".stream")
							.data(streams2)
							.enter()
								.append("path")
									.attr("class", "stream")
									.attr("d", function (d) {
												return area(d);
												})
									.style("fill", function (d, i) {
													return color[i];
													});
	},

	createMultiples : function(startFrame, endFrame){											
		//Calculate the speed in each frame. Uses next frame to determine speed in a frame. Last frame is set to be identical to next to last frame
		var speedDataA = [];
		var speedDataB = [];
		for(var i=0; i<mocom.takeAAngles.length; i++){
			speedDataA[i] = [];
			speedDataB[i] = [];
			for(var j=0; j<endFrame-startFrame; j++){
				speedDataA[i][j] = [((mocom.takeAAngles[i][j+startFrame+1].alpha-mocom.takeAAngles[i][j+startFrame].alpha)/movan.dataTracks[0].content.frameTime), ((mocom.takeAAngles[i][j+startFrame+1].beta-mocom.takeAAngles[i][j+startFrame].beta)/movan.dataTracks[0].content.frameTime)];
				speedDataB[i][j] = [((mocom.takeBAngles[i][j+startFrame+1].alpha-mocom.takeBAngles[i][j+startFrame].alpha)/movan.dataTracks[0].content.frameTime), ((mocom.takeBAngles[i][j+startFrame+1].beta-mocom.takeBAngles[i][j+startFrame].beta)/movan.dataTracks[0].content.frameTime)];
			}
			speedDataA[i][endFrame-startFrame] = speedDataA[i][endFrame-startFrame-1];
			speedDataB[i][endFrame-startFrame] = speedDataB[i][endFrame-startFrame-1];
		}
		//Calculate the acceleration in each frame. Uses next frame to determine acceleration in a frame. Last frame is set to be identical to next to last frame
		var accDataA = [];
		var accDataB = [];
		for(var i=0; i<speedDataA.length; i++){
			accDataA[i] = [];
			accDataB[i] = [];
			for(var j=0; j<endFrame-startFrame; j++){
				accDataA[i][j] = [((speedDataA[i][j+1][0]-speedDataA[i][j][0])/movan.dataTracks[0].content.frameTime), ((speedDataA[i][j+1][1]-speedDataA[i][j][1])/movan.dataTracks[0].content.frameTime)];
				accDataB[i][j] = [((speedDataB[i][j+1][0]-speedDataB[i][j][0])/movan.dataTracks[0].content.frameTime), ((speedDataB[i][j+1][1]-speedDataB[i][j][1])/movan.dataTracks[0].content.frameTime)];
			}
			accDataA[i][endFrame-startFrame] = accDataA[i][endFrame-startFrame-1];
			accDataB[i][endFrame-startFrame] = accDataB[i][endFrame-startFrame-1];
		}
	
		//Find the x-scale based on number of frames
		var xScale = d3.scale.linear()
								.domain([0, endFrame-startFrame])
								.range([5, 295]);
		var xAxis = d3.svg.axis()
							.scale(xScale)
							.outerTickSize(0)
							.ticks(0);
		
		//Find the y-scale based on maximum and minimum values of the data
		var yMaxAngle = 0;
		var yMinAngle = 0;
		var yMaxSpeed = 0;
		var yMinSpeed = 0;
		var yMaxAcc = 0;
		var yMinAcc = 0;
		for(var i=0; i<mocom.takeAAngles.length; i++) {
			for(var j=0; j<endFrame-startFrame; j++) {
			var tempAAngles = [mocom.takeAAngles[i][j+startFrame].alpha, mocom.takeAAngles[i][j+startFrame].beta];
			var tempBAngles = [mocom.takeBAngles[i][j+startFrame].alpha, mocom.takeBAngles[i][j+startFrame].beta];
					if(d3.min(tempAAngles) < yMinAngle){
						yMinAngle = d3.min(tempAAngles);
					}
					else if(d3.max(tempAAngles) > yMaxAngle){
						yMaxAngle = d3.max(tempAAngles);
					}
					if(d3.min(tempBAngles) < yMinAngle){
						yMinAngle = d3.min(tempBAngles);
					}
					else if(d3.max(tempBAngles) > yMaxAngle){
						yMaxAngle = d3.max(tempBAngles);
					}
					if(d3.min(speedDataA[i][j]) < yMinSpeed){
						yMinSpeed = d3.min(speedDataA[i][j]);
					}
					else if(d3.max(speedDataA[i][j]) > yMaxSpeed){
						yMaxSpeed = d3.max(speedDataA[i][j]);
					}
					if(d3.min(speedDataB[i][j]) < yMinSpeed){
						yMinSpeed = d3.min(speedDataB[i][j]);
					}
					else if(d3.max(speedDataB[i][j]) > yMaxSpeed){
						yMaxSpeed = d3.max(speedDataB[i][j]);
					}
					if(d3.min(accDataA[i][j]) < yMinAcc){
						yMinAcc = d3.min(accDataA[i][j]);
					}
					else if(d3.max(accDataA[i][j]) > yMaxAcc){
						yMaxAcc = d3.max(accDataA[i][j]);
					}
					if(d3.min(accDataB[i][j]) < yMinAcc){
						yMinAcc = d3.min(accDataB[i][j]);
					}
					else if(d3.max(accDataB[i][j]) > yMaxAcc){
						yMaxAcc = d3.max(accDataB[i][j]);
					}
				}
			}
		var yScaleAngle = d3.scale.linear()
								.domain([Math.ceil(yMaxAngle), Math.floor(yMinAngle)]) 
								.range([6, 70]);		
		var yScaleSpeed = d3.scale.linear()
								.domain([Math.ceil(yMaxSpeed), Math.floor(yMinSpeed)]) 
								.range([6, 70]);
		var yScaleAcc = d3.scale.linear()
								.domain([Math.ceil(yMaxAcc), Math.floor(yMinAcc)]) 
								.range([6, 70]);
		
			
		//Create y-axis
		var yAxisAngle = d3.svg.axis()
								.scale(yScaleAngle)
								.orient("right")
								.ticks(0)
								.tickValues(yScaleAngle.domain());
		var yAxisSpeed = d3.svg.axis()
								.scale(yScaleSpeed)
								.orient("right")
								.ticks(0)
		var yAxisAcc = d3.svg.axis()
								.scale(yScaleAcc)
								.orient("right")
								.ticks(0)
								
		var lineAngleP1 = d3.svg.line()
							.x(function(d, i) { return xScale(i); })
							.y(function(d) { return yScaleAngle(d.alpha); });
		var lineAngleP2 = d3.svg.line()
							.x(function(d, i) { return xScale(i); })
							.y(function(d) { return yScaleAngle(d.beta); });
		var lineSpeedP1 = d3.svg.line()
							.x(function(d, i) { return xScale(i); })
							.y(function(d) { return yScaleSpeed(d[0]); });
		var lineSpeedP2 = d3.svg.line()
							.x(function(d, i) { return xScale(i); })
							.y(function(d) { return yScaleSpeed(d[1]); });
		var lineAccP1 = d3.svg.line()
							.x(function(d, i) { return xScale(i); })
							.y(function(d) { return yScaleAcc(d[0]); });
		var lineAccP2 = d3.svg.line()
							.x(function(d, i) { return xScale(i); })
							.y(function(d) { return yScaleAcc(d[1]); });
								
		var multiplesP1 = d3.select("#visMultiplesP1");
		var multiplesP2 = d3.select("#visMultiplesP2");
		var angleChartsP1 = multiplesP1.select("#angleCharts");
		var angleChartsP2 = multiplesP2.select("#angleCharts");
		var speedChartsP1 = multiplesP1.select("#speedCharts");
		var speedChartsP2 = multiplesP2.select("#speedCharts");
		var accelerationChartsP1 = multiplesP1.select("#accelerationCharts");
		var accelerationChartsP2 = multiplesP2.select("#accelerationCharts");
		multiplesP1.selectAll(".multipleSVG").remove();
		multiplesP2.selectAll(".multipleSVG").remove();		
		var anglesP1A = angleChartsP1.selectAll(".smallMultiple")
										.data(mocom.takeAAngles.map(function(d){
																		return d.filter(function(d,i){
																						if (i >= startFrame && i <= endFrame){ return true;}
																						else{return false;}
																						});
																				}
																	)
												)
										.append("svg")
											.attr("class", "multipleSVG");
		var anglesP1B = angleChartsP1.selectAll(".smallMultiple")
										.data(mocom.takeBAngles.map(function(d){
																		return d.filter(function(d,i){
																						if (i >= startFrame && i <= endFrame){ return true;}
																						else{return false;}
																						});
																				}
																	)
												)
										.append("svg")
											.attr("class", "multipleSVG");
		var anglesP2A = angleChartsP2.selectAll(".smallMultiple")
										.data(mocom.takeAAngles.map(function(d){
																		return d.filter(function(d,i){
																						if (i >= startFrame && i <= endFrame){ return true;}
																						else{return false;}
																						});
																				}
																	)
												)
										.append("svg")
											.attr("class", "multipleSVG");
		var anglesP2B = angleChartsP2.selectAll(".smallMultiple")
										.data(mocom.takeBAngles.map(function(d){
																		return d.filter(function(d,i){
																						if (i >= startFrame && i <= endFrame){ return true;}
																						else{return false;}
																						});
																				}
																	)
												)
										.append("svg")
											.attr("class", "multipleSVG");
		var speedsP1A = speedChartsP1.selectAll(".smallMultiple")
										.data(speedDataA)
										.append("svg")
											.attr("class", "multipleSVG");
		var speedsP1B = speedChartsP1.selectAll(".smallMultiple")
										.data(speedDataB)
										.append("svg")
											.attr("class", "multipleSVG");													
		var speedsP2A = speedChartsP2.selectAll(".smallMultiple")
										.data(speedDataA)
										.append("svg")
											.attr("class", "multipleSVG");
		var speedsP2B = speedChartsP2.selectAll(".smallMultiple")
										.data(speedDataB)
										.append("svg")
											.attr("class", "multipleSVG");
		var accsP1A = accelerationChartsP1.selectAll(".smallMultiple")
										.data(accDataA)
										.append("svg")
											.attr("class", "multipleSVG");		
		var accsP1B = accelerationChartsP1.selectAll(".smallMultiple")
										.data(accDataB)
										.append("svg")
											.attr("class", "multipleSVG");												
		var accsP2A = accelerationChartsP2.selectAll(".smallMultiple")
										.data(accDataA)
										.append("svg")
											.attr("class", "multipleSVG");
		var accsP2B = accelerationChartsP2.selectAll(".smallMultiple")
										.data(accDataB)
										.append("svg")
											.attr("class", "multipleSVG");
		anglesP1A.append("g")
					.attr("class", "multipleAxisY")
					.call(yAxisAngle);
		anglesP1A.append("g")
					.attr("class", "multipleAxisX")
					.attr("transform", "translate(0," + yScaleAngle(0) + ")")
					.call(xAxis);
		anglesP1A.append("path")
					.attr("class", "line")
					.attr("d", function (d) {
								return lineAngleP1(d);
								});
		anglesP1B.append("path")
					.attr("class", "line")
					.attr("d", function (d) {
								return lineAngleP1(d);
								});	
		anglesP2A.append("g")
					.attr("class", "multipleAxisY")
					.call(yAxisAngle);
		anglesP2A.append("g")
					.attr("class", "multipleAxisX")
					.attr("transform", "translate(0," + yScaleAngle(0) + ")")
					.call(xAxis);
		anglesP2A.append("path")
					.attr("class", "line")
					.attr("d", function (d) {
								return lineAngleP2(d);
								});
		anglesP2B.append("path")
					.attr("class", "line")
					.attr("d", function (d) {
								return lineAngleP2(d);
								});
		speedsP1A.append("g")
					.attr("class", "multipleAxisY")
					.call(yAxisSpeed);
		speedsP1A.append("g")
					.attr("class", "multipleAxisX")
					.attr("transform", "translate(0," + yScaleSpeed(0) + ")")
					.call(xAxis);
		speedsP1A.append("path")
					.attr("class", "line")
					.attr("d", function (d) {
								return lineSpeedP1(d);
								});
		speedsP1B.append("path")
					.attr("class", "line")
					.attr("d", function (d) {
								return lineSpeedP1(d);
								});	
		speedsP2A.append("g")
					.attr("class", "multipleAxisY")
					.call(yAxisSpeed);
		speedsP2A.append("g")
					.attr("class", "multipleAxisX")
					.attr("transform", "translate(0," + yScaleSpeed(0) + ")")
					.call(xAxis);
		speedsP2A.append("path")
					.attr("class", "line")
					.attr("d", function (d) {
								return lineSpeedP2(d);
								});
		speedsP2B.append("path")
					.attr("class", "line")
					.attr("d", function (d) {
								return lineSpeedP2(d);
								});
		accsP1A.append("g")
					.attr("class", "multipleAxisY")
					.call(yAxisAcc);
		accsP1A.append("g")
					.attr("class", "multipleAxisX")
					.attr("transform", "translate(0," + yScaleAcc(0) + ")")
					.call(xAxis);
		accsP1A.append("path")
					.attr("class", "line")
					.attr("d", function (d) {
								return lineAccP1(d);
								});
		accsP1B.append("path")
					.attr("class", "line")
					.attr("d", function (d) {
								return lineAccP1(d);
								});	
		accsP2A.append("g")
					.attr("class", "multipleAxisY")
					.call(yAxisAcc);
		accsP2A.append("g")
					.attr("class", "multipleAxisX")
					.attr("transform", "translate(0," + yScaleAcc(0) + ")")
					.call(xAxis);
		accsP2A.append("path")
					.attr("class", "line")
					.attr("d", function (d) {
								return lineAccP2(d);
								});
		accsP2B.append("path")
					.attr("class", "line")
					.attr("d", function (d) {
								return lineAccP2(d);
								});							
	},

	createInstView : function(frameIndex){
		// get the frame
		// var currentFrameA = movan.dataTracks[0].content.getPositionsAt(frameIndex);
		// var currentFrameB = movan.dataTracks[1].content.getPositionsAt(frameIndex);
		var currentFrameA = mocom.takeAPos.map(function(d){
			return d.filter(function(d,i){
				if(i==frameIndex) return true;
				else return false;
			});
		});
		var currentFrameB = mocom.takeBPos.map(function(d){
			return d.filter(function(d,i){
				if(i==frameIndex) return true;
				else return false;
			});
		});

		// * TakeAPosition[
		// * 	jointArray1[{x:0, y:0, z:0},{},{},...],     "Root" joint (center shoulder or center hip
		// * 	jointArray2[{x:0, y:0, z:0},{},{},...],		Spine joint
		// * 	jointArray3[{x:0, y:0, z:0},{},{},...],		"Connecting" joint/body part joint 1 (joint that connects body part to core, right/left shoulder or hip
		// * 	jointArray4[{x:0, y:0, z:0},{},{},...],		Body part joint 2 (elbow or knee)
		// * 	jointArray5[{x:0, y:0, z:0},{},{},...],		Body part joint 3 (wrist or ankle)
		// * 	jointArray6[{x:0, y:0, z:0},{},{},...]		Body part joint 4 (hand or foot)
		// var currentFrameA = takeAPosition;
		// var currentFrameB = takeBPosition;

		/**
		takeAPos and takeBPos format:
		takeAPos = [
		joint0[frame0[[x,y,z],[x,y,z] ]]
		joint1[frame0[[x,y,z],[x,y,z] ]]
		joint2[frame0[[x,y,z],[x,y,z] ]]
		joint3[frame0[[x,y,z],[x,y,z] ]]
		joint4[frame0[[x,y,z],[x,y,z] ]]
		joint5[frame0[[x,y,z],[x,y,z] ]]
		]
		**/
		// map out the perspectives of A and B
		var currentFrameP1A = currentFrameA.map(function(d,i) {
			return {
				x : d[0][0][0]+20,
				y : -1*(d[0][0][1])+20,
				z : d[0][0][2]
			};
		});
		var currentFrameP1B = currentFrameB.map(function(d) {
			return {
				x : d[0][0][0]+20,
				y : -1*(d[0][0][1])+20,
				z : d[0][0][2]
				// x : d.x + 20,
				// y : -1 * d.y + 70,
				// z : d.z
			};
		});
		var currentFrameP2A = currentFrameA.map(function(d) {
			return {
				x : d[0][1][0]+20,
				y : -1*d[0][1][1]+20,
				z : d[0][1][2]
			};
		});
		var currentFrameP2B = currentFrameB.map(function(d) {
			return {
				x : d[0][1][0]+20,
				y : -1*d[0][1][1]+20,
				z : d[0][1][2]
				// x : 1 * d.z + 170,
				// y : -1 * d.y + 70,
				// z : d.x +20
			};
		});

		// append svg
		d3.selectAll("#visInstFrameP1, #visInstFrameP2").selectAll("svg").remove();
		var visInstFrameP1A = d3.select("#visInstFrameP1 .visInstFrameA").append("svg").attr("height",70);
		var visInstFrameP1B = d3.select("#visInstFrameP1 .visInstFrameB").append("svg").attr("height",70);
		var visInstFrameP2A = d3.select("#visInstFrameP2 .visInstFrameA").append("svg").attr("height",70);
		var visInstFrameP2B = d3.select("#visInstFrameP2 .visInstFrameB").append("svg").attr("height",70);
		
		// match the data to svg - draw em all
		//drawSkelPartial(svg, currentFrameA, index, highlightJ, mocap, jointfilter)
		figureSketch.drawSkelPartial(visInstFrameP1A, currentFrameP1A, 0, 0, movan.dataTracks[0].content, mocom.neededJoint);
		figureSketch.drawSkelPartial(visInstFrameP1B, currentFrameP1B, 0, 0, movan.dataTracks[0].content, mocom.neededJoint);
		figureSketch.drawSkelPartial(visInstFrameP2A, currentFrameP2A, 0, 0, movan.dataTracks[0].content, mocom.neededJoint);
		figureSketch.drawSkelPartial(visInstFrameP2B, currentFrameP2B, 0, 0, movan.dataTracks[0].content, mocom.neededJoint);
	},

	angleData : {

	/* angleData.calculate is the main function that updates the global variables holding the angle data for all joints in all frames
	input: 
	Take1Position[
		jointArray1[{x:0, y:0, z:0},{},{},...],     "Root" joint (center shoulder or center hip)
		jointArray2[{x:0, y:0, z:0},{},{},...],		Spine joint
		jointArray3[{x:0, y:0, z:0},{},{},...],		"Connecting" joint/body part joint 1 (joint that connects body part to core, right/left shoulder or hip
		jointArray4[{x:0, y:0, z:0},{},{},...],		Body part joint 2 (elbow or knee)
		jointArray5[{x:0, y:0, z:0},{},{},...],		Body part joint 3 (wrist or ankle)
		jointArray6[{x:0, y:0, z:0},{},{},...]		Body part joint 4 (hand or foot)
	]
	Take2Position[......]	Same as above but for the second take
	>>>>>>> origin/v0.7

	output (updates the global variables in mocom format):
	Take1Angle[
		jointArray1[{alpha:0, beta:0},{},...],
		jointArray2[{alpha:0, beta:0},{},...],
		jointArray3[{alpha:0, beta:0},{},...]
	]
	Take2Angle[......]	Same as above but for the second take	*/

	/* Function convertData takes the input array for one of the takes and converts it to the output array as specified above	*/
		convertData : function(jointPositions){
			var jointAngles = [];	//mocom variable is the output array eventually returned
			var jointNewPos = [];
			jointAngles[0] = [];	//Creates one array of frames for each joint
			jointAngles[1] = [];
			jointAngles[2] = [];
			jointNewPos[0] = [];
			jointNewPos[1] = [];
			jointNewPos[2] = [];
			jointNewPos[3] = [];
			jointNewPos[4] = [];
			jointNewPos[5] = [];
			for (var i = 0; i < jointPositions[0].length; i++){	//Loops through all the frames as given by the length of one of the joint arrays in the input array
				var anchorJoint = [0,0,0];					//Anchor joint for new coordinate system
				var spineJoint = mocom.angleData.getDirection(jointPositions[0][i], jointPositions[1][i]);			//Translates the other coordinate joints according to anchorJoint
				var partJoint = mocom.angleData.getDirection(jointPositions[0][i], jointPositions[2][i]);
				var spine_axis = mocom.angleData.findAxis_spine(spineJoint, anchorJoint);		//Defines the axis of the new coordinate systems, these are unit vectors
				var side_axis = mocom.angleData.findAxis_width(partJoint, spine_axis);
				var depth_axis = mocom.angleData.findAxis_depth(spine_axis, side_axis);
				jointNewPos[0][i] = [anchorJoint, anchorJoint];
				jointNewPos[1][i] = [[0, mocom.angleData.project(spineJoint, depth_axis)[1],0] , [0,mocom.angleData.project(spineJoint, side_axis)[1],0]];
				jointNewPos[2][i] = [[mocom.angleData.project(partJoint, depth_axis)[0],0,0], [0,0,0]];
				jointNewPos[3][i] = [mocom.angleData.project(mocom.angleData.getDirection(jointPositions[0][i],jointPositions[3][i]), depth_axis), mocom.angleData.project(mocom.angleData.getDirection(jointPositions[0][i], jointPositions[3][i]), side_axis)];
				jointNewPos[4][i] = [mocom.angleData.project(mocom.angleData.getDirection(jointPositions[0][i],jointPositions[4][i]), depth_axis), mocom.angleData.project(mocom.angleData.getDirection(jointPositions[0][i],jointPositions[4][i]), side_axis)];
				jointNewPos[5][i] = [mocom.angleData.project(mocom.angleData.getDirection(jointPositions[0][i],jointPositions[5][i]), depth_axis), mocom.angleData.project(mocom.angleData.getDirection(jointPositions[0][i],jointPositions[5][i]), side_axis)];
				jointAngles[0][i] = mocom.angleData.vectorAngle(jointNewPos[2][i], jointNewPos[3][i], spine_axis, side_axis, depth_axis);		//Fills the array for each joint
				jointAngles[1][i] = mocom.angleData.vectorAngle(jointNewPos[3][i], jointNewPos[4][i], spine_axis, side_axis, depth_axis);		//The return of vectorAngle function is an array with angles alpha and beta
				jointAngles[2][i] = mocom.angleData.vectorAngle(jointNewPos[4][i], jointNewPos[5][i], spine_axis, side_axis, depth_axis);		//These angles define the position of limbs in the new coordinate system
				jointAngles[2][i].alpha -= jointAngles[1][i].alpha;
				jointAngles[2][i].beta -= jointAngles[1][i].beta;		
				jointAngles[1][i].alpha -= jointAngles[0][i].alpha;
				jointAngles[1][i].beta -= jointAngles[0][i].beta;
			}
			return [jointAngles, jointNewPos];
		},
		
		getDirection : function(origin, point){
				var newPoint = [
				point[0] - origin[0],
				point[1] - origin[1],
				point[2] - origin[2]
				];
				return newPoint;
		},

		findAxis_spine : function(spineJoint, anchorJoint) {
			var spine_axis = mocom.angleData.normalize(spineJoint);				//Normalizing the vector by dividing the components by its length
			return spine_axis;
		},
		
	/* Function findAxis_width : Returns a unit vector in the direction parallel to shoulder or hip line.
	Input joints are spine and the joint connecting the extremity to the core of the skeleton. */
		findAxis_width : function(partJoint, spine_axis) {
			var scalar = mocom.angleData.dotproduct(partJoint, spine_axis);		//Finds the point on the spine where a perpendicular line can be drawn to the part joint
			var refPoint = [
				spine_axis[0]*scalar,
				spine_axis[1]*scalar,
				spine_axis[2]*scalar
			];
			var side_vector = mocom.angleData.getDirection(refPoint, partJoint);				//Direction between spine and part joint
			var side_axis = mocom.angleData.normalize(side_vector);
			return side_axis;
		},
		
	/* Function findAxis_depth: Returns a unit vector in the direction perpendicular to input vectors */
		findAxis_depth : function(spine_axis, side_axis) {
			var depth_vector = mocom.angleData.crossproduct(spine_axis, side_axis);		//Using cross product of the two identified vectors to find the third one (perpendicular to both)
			var depth_axis = mocom.angleData.normalize(depth_vector);
			return depth_axis;
		},
		
	//Function project: Projects input point onto plane defined by input normal vector (origin 0,0,0 has to be in the plane)
		project : function(point, planeNormal){
			var scalar = mocom.angleData.dotproduct(point, planeNormal);
			var proj_point = [
				point[0] - (scalar * planeNormal[0]),
				point[1] - (scalar * planeNormal[1]),
				point[2] - (scalar * planeNormal[2])
			];
			return proj_point;
		},
		
	//Function vectorAngle: Calculates the angles between the bone connecting input arguments and spine in front and side perspectives (as defined by the axis passed)
		vectorAngle : function(node1, node2, relativeAxis, viewAxis1, viewAxis2) {
			var node1_front = node1[0];		//Projects the limbs in both perpectives
			var node1_side = node1[1];
			var node2_front = node2[0];
			var node2_side = node2[1];
			var v = mocom.angleData.getDirection(node1_front, node2_front);							//Vector of limb in front perspective
			var alpha = (Math.atan2(mocom.angleData.dotproduct(v, relativeAxis), mocom.angleData.dotproduct(v, viewAxis2))) * 2 * Math.PI;
			v = mocom.angleData.getDirection(node1_side, node2_side);								//Changes the vector of limb to use second perspective
			var beta = (Math.atan2(mocom.angleData.dotproduct(v, relativeAxis), mocom.angleData.dotproduct(v, viewAxis1))) * 2 * Math.PI;
			return { alpha, beta };
		},
		
	//Function to calculate the scalar product of vector a and b, returns scalar n
		dotproduct : function(a,b) {
			var n = 0;
			for (var i=0; i<3; i++) {
				n += a[i] * b[i];
			}
			return n;
		},
		
	//Function to calculate the vector product of vector a and b, returns vector c
		crossproduct : function(a,b) {							
			var c = [
				((a[1] * b[2]) - (a[2] * b[1])),
				((a[2] * b[0]) - (a[0] * b[2])),
				((a[0] * b[1]) - (a[1] * b[0]))
			];
			return c;
		},
		
		normalize : function(a) {
			var length = Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2));
			if (length > 0) {
			var normVector = [											//Normalizing the vector by dividing the components by its length
				a[0] / length,
				a[1] / length,
				a[2] / length
			];
			}
			else{
			var normVector = [0,0,0];
			}
			return normVector;
		}
	},

	closewindow : function(){
		$("#visCont").hide();
		d3.selectAll("#visCont svg").remove();
	}


};