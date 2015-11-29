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
var L_PALM		= 8;
// right arm
var R_SHOULDER	= 0;
var R_ELBLOW	= 0;
var R_WRIST		= 0;
var R_PALM		= 0;
// left leg
var L_HIP		= 0;
var L_KNEE		= 0;
var L_ANKLE		= 0;
var L_FOOT		= 0;
// right leg
var R_HIP		= 0;
var R_KNEE		= 0;
var R_ANKLE		= 0;
var R_FOOT		= 0;
// conter
var C_HIP		= 0;
var SPINE		= 1;
var C_SHOULDER	= 4;
var HEAD		= 0;


var mocom = {

	takeAAngles : [],

	takeBAngles : [],

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

		var neededJoint = [];
		var takeAPosition = [];
		var takeBPosition = [];
		switch( parseInt($("#bodypart").find(":selected").attr("data-bodypart")) ){
			case LEFTARM :
			neededJoint = [C_SHOULDER, SPINE, L_SHOULDER, L_ELBLOW, L_WRIST, L_PALM];
			break;

			case RIGHTARM : 
			neededJoint = [C_SHOULDER, SPINE, R_SHOULDER, R_ELBLOW, R_WRIST, R_PALM];
			break;

			case LEFTLEG :
			neededJoint = [C_HIP, SPINE, L_HIP, L_KNEE, L_ANKLE, L_FOOT];
			break;

			case RIGHTLEG :
			neededJoint = [C_HIP, SPINE, R_HIP, R_KNEE, R_ANKLE, R_FOOT];
			break;

			case SPINE :
			neededJoint = [C_HIP, SPINE, C_SHOULDER, HEAD];
			break;

			default:
			neededJoint = [];
		}

		// clear up the dataTracks and load our track to it.
		movan.dataTracks = [];
		fileHandler.loadDataTrack(urlA, function(dataTrack, t){
			movan.dataTracks.push({content: dataTrack, type: t});

			takeLoadCnt++;
			if(takeLoadCnt>=2){
				$("#visCont .loaderWrap").remove();
			}

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
					tmp = movan.dataTracks[0].content.jointArray[ neededJoint[j] ].positions[i]; 
					takeAPosition[j].push(tmp);
				}
			}
			mocom.takeAAngles = mocom.angleData.convertData(takeAPosition);
		});

		fileHandler.loadDataTrack(urlB, function(dataTrack, t){
			movan.dataTracks.push({content: dataTrack, type: t});

			takeLoadCnt++;
			if(takeLoadCnt>=2){
				$("#visCont .loaderWrap").remove();
			}

			var frameTimeB = movan.dataTracks[1].content.frameTime;
			var lastFrameB = movan.dataTracks[0].content.frameCount;
			var startFrameB = Math.floor(starttimeA / frameTimeB);
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
					tmp = movan.dataTracks[0].content.jointArray[ neededJoint[j] ].positions[i]; 
					takeBPosition[j].push(tmp);
				}
			}
			mocom.takeBAngles = mocom.angleData.convertData(takeBPosition);
		});
		

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
			jointAngles[0] = [];	//Creates one array of frames for each joint
			jointAngles[1] = [];
			jointAngles[2] = [];
			for (var i = 0; i < jointPositions[0].length; i++){	//Loops through all the frames as given by the length of one of the joint arrays in the input array
				var anchorJoint = jointPositions[0][i];					//Anchor joint for new coordinate system
				var spineJoint = mocom.angleData.getDirection(anchorJoint, jointPositions[1][i]);			//Translates the other coordinate joints according to anchorJoint
				var partJoint = mocom.angleData.getDirection(anchorJoint, jointPositions[2][i]);
				var spine_axis = mocom.angleData.findAxis_spine(spineJoint, anchorJoint);		//Defines the axis of the new coordinate systems, these are unit vectors
				var side_axis = mocom.angleData.findAxis_width(spineJoint, partJoint, spine_axis);
				var depth_axis = mocom.angleData.findAxis_depth(spine_axis, side_axis);
				jointAngles[0][i] = mocom.angleData.vectorAngle(jointPositions[2][i], jointPositions[3][i], spine_axis, depth_axis, side_axis);		//Fills the array for each joint
				jointAngles[1][i] = mocom.angleData.vectorAngle(jointPositions[3][i], jointPositions[4][i], spine_axis, depth_axis, side_axis);		//The return of vectorAngle function is an array with angles alpha and beta
				jointAngles[2][i] = mocom.angleData.vectorAngle(jointPositions[4][i], jointPositions[5][i], spine_axis, depth_axis, side_axis);		//These angles define the position of limbs in the new coordinate system
			}
			return jointAngles;
		},
		
		getDirection : function(origin, point){
				var newPoint = [
				point[0] - origin[0],
				point[1] - origin[1],
				point[2] - origin[2]
				];
				return newPoint;
		},

	/* Function findAxis_width : Returns a unit vector in the direction parallel to shoulder or hip line.
	Input joints are spine and the joint connecting the extremity to the core of the skeleton. */
		findAxis_spine : function(spineJoint, anchorJoint) {
			var spine_vector = mocom.angleData.getDirection(anchorJoint, spineJoint);
			var spine_axis = mocom.angleData.normalize(spine_vector);				//Normalizing the vector by dividing the components by its length
			return spine_axis;
		},
		
	/* Function findAxis_width : Returns a unit vector in the direction parallel to shoulder or hip line.
	Input joints are spine and the joint connecting the extremity to the core of the skeleton. */
		findAxis_width : function(spineJoint, partJoint, spine_axis) {
			var scalar = mocom.angleData.dotproduct(partJoint, spine_axis);		//Finds the point on the spine where a perpendicular line can be drawn to the part joint
			var refPoint = [
				spine_axis[0]*scalar,
				spine_axis[1]*scalar,
				spine_axis[2]*scalar
			];
			var side_vector = mocom.angleData.getDirection(refPoint, spineJoint);				//Direction between spine and part joint
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
			var node1_front = mocom.angleData.project(node1, viewAxis1);		//Projects the limbs in both perpectives
			var node1_side = mocom.angleData.project(node1, viewAxis2);
			var node2_front = mocom.angleData.project(node2, viewAxis1);
			var node2_side = mocom.angleData.project(node2, viewAxis2);
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
			var c = [];
			c[0] =   ((a[1] * b[2]) - (a[2] * b[1]));
			c[1] = - ((a[0] * b[2]) - (a[2] * b[0]));
			c[2] =   ((a[0] * b[1]) - (a[1] * b[0]));
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
	}


};