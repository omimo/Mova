// initialized by Sunny at Nov 26, 2015

// bodyparts
var LEFTARM		= 0;
var RIGHTARM	= 1;
var LEFTLEG		= 2;
var RIGHTLEG	= 3;
var CENTER		= 4;

// joints index
// left arm
var L_SHOULDER	= 0;
var L_ELBLOW	= 0;
var L_WRIST		= 0;
var L_PALM		= 0;
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
var SPINE		= 0;
var C_SHOULDER	= 0;
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
		// get from gui
		var urlA = document.getElementById("sltURLA").value;
		var urlB = document.getElementById("sltURLB").value;
		var starttimeA = document.getElementById("takeStartTimeA").value;
		var starttimeB = document.getElementById("takeStartTimeB").value;
		var duration = document.getElementById("duration").value;
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
			// get the start frame index, length
			// different framerates (of takeA and takeB) might cause proublem later, but since we mostly consider takes in a same project so we ignore it for now.
			var frameTimeA = movan.dataTracks[0].content.frameTime;
			var startFrameA = Math.floor(starttimeA / frameTimeA);
			var endFrameA = startFrameA + Math.floor(duration / frameTimeA);
			var jointArray1 = jointArray2 = jointArray3 = jointArray4 = jointArray5 = jointArray6 = []; //tmp joint holders
			for (var i=startFrameA; i<endFrameA; i++){
				var tmp = [];
				tmp = movan.dataTracks[0].content.jointArray[ neededJoint[0] ].positions[i]; 
				jointArray1.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[0].content.jointArray[ neededJoint[1] ].positions[i]; jointArray2.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[0].content.jointArray[ neededJoint[2] ].positions[i]; jointArray3.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[0].content.jointArray[ neededJoint[3] ].positions[i]; jointArray4.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[0].content.jointArray[ neededJoint[4] ].positions[i]; jointArray5.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[0].content.jointArray[ neededJoint[5] ].positions[i]; jointArray6.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
			}
			takeAPosition = [jointArray1, jointArray2, jointArray3, jointArray4, jointArray5, jointArray6];
			mocom.takeAAngles = mocom.angleData.convertData(takeAPosition);
		});

		fileHandler.loadDataTrack(urlB, function(dataTrack, t){
			movan.dataTracks.push({content: dataTrack, type: t});
			var frameTimeB = movan.dataTracks[1].content.frameTime;
			var startFrameB = Math.floor(starttimeA / frameTimeB);
			var endFrameB = startFrameB + Math.floor(duration / frameTimeB);
			var jointArray1 = jointArray2 = jointArray3 = jointArray4 = jointArray5 = jointArray6 = []; //tmp joint holders
			for (var i=startFrameB; i<endFrameB; i++){
				var tmp = [];
				tmp = movan.dataTracks[1].content.jointArray[ neededJoint[0] ].positions[i]; jointArray1.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[1].content.jointArray[ neededJoint[1] ].positions[i]; jointArray2.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[1].content.jointArray[ neededJoint[2] ].positions[i]; jointArray3.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[1].content.jointArray[ neededJoint[3] ].positions[i]; jointArray4.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[1].content.jointArray[ neededJoint[4] ].positions[i]; jointArray5.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[1].content.jointArray[ neededJoint[5] ].positions[i]; jointArray6.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );		}
			takeBPosition = [jointArray1, jointArray2, jointArray3, jointArray4, jointArray5, jointArray6];
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
				var anchorJoint = jointPositions[0][i];													//Anchor joint for new coordinate system
				var spineJoint = mocom.angleData.translateOrigin(jointPositions[0][i], jointPositions[1][i]);			//Translates the other coordinate joints according to anchorJoint
				var partJoint = mocom.angleData.translateOrigin(jointPositions[0][i], jointPositions[2][i]);
				var spine_axis = mocom.angleData.findAxis_spine(spineJoint, anchorJoint);		//Defines the axis of the new coordinate systems, these are unit vectors
				var side_axis = mocom.angleData.findAxis_width(spineJoint, partJoint, spine_axis);
				var depth_axis = mocom.angleData.findAxis_depth(spine_axis, side_axis);
				jointAngles[0][i] = mocom.angleData.vectorAngle(jointPositions[2][i], jointPositions[3][i], spine_axis, depth_axis, side_axis);		//Fills the array for each joint
				jointAngles[1][i] = mocom.angleData.vectorAngle(jointPositions[3][i], jointPositions[4][i], spine_axis, depth_axis, side_axis);		//The return of vectorAngle function is an array with angles alpha and beta
				jointAngles[2][i] = mocom.angleData.vectorAngle(jointPositions[4][i], jointPositions[5][i], spine_axis, depth_axis, side_axis);		//These angles define the position of limbs in the new coordinate system
			}
			return jointAngles;
		},
		
		translateOrigin : function(newOrigin, point){
				point -= newOrigin;
				return point;
		},

	/* Function findAxis_width : Returns a unit vector in the direction parallel to shoulder or hip line.
	Input joints are spine and the joint connecting the extremity to the core of the skeleton. */
		findAxis_spine : function(spineJoint, anchorJoint) {
			var spine_vector = [					//Direction of spine
				anchorJoint[0] - spineJoint[0],
				anchorJoint[1] - spineJoint[1],
				anchorJoint[2] - spineJoint[2]
			];
			var spine_length = Math.sqrt(Math.pow(spine_vector[0], 2) + Math.pow(spine_vector[1], 2) + Math.pow(spine_vector[2], 2));
			var spine_axis = [						//Normalizing the vector by dividing the components by its length
				spine_vector[0] / spine_length,
				spine_vector[1] / spine_length,
				spine_vector[2] / spine_length
			];
			return spine_axis;
		},
		
	/* Function findAxis_width : Returns a unit vector in the direction parallel to shoulder or hip line.
	Input joints are spine and the joint connecting the extremity to the core of the skeleton. */
		findAxis_width : function(spineJoint, partJoint, spine_axis) {
			var ref_point = mocom.angleData.dotproduct(partJoint, spine_axis) * spine_axis;		//Finds the point on the spine where a perpendicular line can be drawn to the part joint
			var side_vector = [				//Direction between spine and part joint
				spineJoint[0] - ref_point[0],
				spineJoint[1] - ref_point[1],
				spineJoint[2] - ref_point[2]
			];
			var side_length = Math.sqrt(Math.pow(side_vector[0], 2) + Math.pow(side_vector[1], 2) + Math.pow(side_vector[2], 2));
			var side_axis = [						//Normalizing the vector by dividing the components by its length
				side_vector[0] / side_length,
				side_vector[1] / side_length,
				side_vector[2] / side_length
			];
			return side_axis;
		},
		
	/* Function findAxis_depth: Returns a unit vector in the direction perpendicular to input vectors */
		findAxis_depth : function(spine_axis, side_axis) {
			var depth_vector = mocom.angleData.crossproduct(spine_axis, side_axis);		//Using cross product of the two identified vectors to find the third one (perpendicular to both)
			var depth_length = Math.sqrt(Math.pow(depth_vector[0], 2) + Math.pow(depth_vector[1], 2) + Math.pow(depth_vector[2], 2));
			var depth_axis = [											//Normalizing the vector by dividing the components by its length
				depth_vector[0] / depth_length,
				depth_vector[1] / depth_length,
				depth_vector[2] / depth_length
			];
			return depth_axis;
		},
		
	//Function project: Projects input point onto plane defined by input normal vector (origin 0,0,0 has to be in the plane)
		project : function(point, planeNormal){
			var proj_point = (point - (mocom.angleData.dotproduct(point, planeNormal)) * planeNormal);
			return proj_point;
		},
		
	//Function vectorAngle: Calculates the angles between the bone connecting input arguments and spine in front and side perspectives (as defined by the axis passed)
		vectorAngle : function(node1, node2, relativeAxis, viewAxis1, viewAxis2) {
			var node1_front = mocom.angleData.project(node1, viewAxis1);		//Projects the limbs in both perpectives
			var node1_side = mocom.angleData.project(node1, viewAxis2);
			var node2_front = mocom.angleData.project(node2, viewAxis1);
			var node2_side = mocom.angleData.project(node2, viewAxis2);
			var v = [								//Vector of limb in front perspective
				node2_front[0] - node1_front[0],
				node2_front[1] - node1_front[1],
				node2_front[2] - node1_front[2]
			];
			var alpha = Math.atan2(mocom.angleData.dotproduct(relativeAxis, v), mocom.angleData.dotproduct(viewAxis1, v)) * 2 * Math.PI;	//Angle calculations for first perspective
			v = [									//Changes the vector of limb to use second perspective
				node2_side[0] - node1_side[0],
				node2_side[1] - node1_side[1],
				node2_side[2] - node1_side[2]
			];
			var beta = Math.atan2(mocom.angleData.dotproduct(relativeAxis, v), mocom.angleData.dotproduct(viewAxis2, v)) * 2 * Math.PI;	//Angle calculations for second perspective
			return { alpha, beta };
		},
		
	//Function to calculate the scalar product of vector a and b, returns scalar n
		dotproduct : function(a,b) {
			var n = 0;
			var lim = Math.min(a.length,b.length);
			for (var i=0; i<lim; i++) {
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
		}
	}


};