var angleData = {

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

output (updates the global variables in this format):
Take1Angle[
	jointArray1[{alpha:0, beta:0},{},...],
	jointArray2[{alpha:0, beta:0},{},...],
	jointArray3[{alpha:0, beta:0},{},...]
]
Take2Angle[......]	Same as above but for the second take	*/
	calculate : function(take1Positions, take2Positions){
	var takeAAngles = convertData(take1Positions);
	var takeBAngles = convertData(take2Positions);
	},

/* Function convertData takes the input array for one of the takes and converts it to the output array as specified above	*/
	convertData : function(jointPositions){
		var jointAngles = [];	//This variable is the output array eventually returned
		jointAngles[0] = [];	//Creates one array of frames for each joint
		jointAngles[1] = [];
		jointAngles[2] = [];
		for (var i = 0; i < jointPositions[0].length; i++){	//Loops through all the frames as given by the length of one of the joint arrays in the input array
			var anchorJoint = jointPositions[0][i];													//Anchor joint for new coordinate system
			var spineJoint = translateOrigin(jointPositions[0][i], jointPositions[1][i]);			//Translates the other coordinate joints according to anchorJoint
			var partJoint = translateOrigin(jointPositions[0][i], jointPositions[2][i]);
			var spine_axis = findAxis_spine(spineJoint, anchorJoint);		//Defines the axis of the new coordinate systems, these are unit vectors
			var side_axis = findAxis_width(spineJoint, partJoint, spine_axis);
			var depth_axis = findAxis_depth(spine_axis, side_axis);
			jointAngles[0][i] = vectorAngle(jointPositions[2][i], jointPositions[3][i], spine_axis, depth_axis, side_axis);		//Fills the array for each joint
			jointAngles[1][i] = vectorAngle(jointPositions[3][i], jointPositions[4][i], spine_axis, depth_axis, side_axis);		//The return of vectorAngle function is an array with angles alpha and beta
			jointAngles[2][i] = vectorAngle(jointPositions[4][i], jointPositions[5][i], spine_axis, depth_axis, side_axis);		//These angles define the position of limbs in the new coordinate system
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
		var spine_vector = {					//Direction of spine
			anchorJoint[0] - spineJoint[0],
			anchorJoint[1] - spineJoint[1],
			anchorJoint[2] - spineJoint[2]
		};
		var spine_length = Math.sqrt(Math.pow(spine_vector[0], 2) + Math.pow(spine_vector[1], 2) + Math.pow(spine_vector[2], 2));
		var spine_axis = {						//Normalizing the vector by dividing the components by its length
			spine_vector[0] / spine_length,
			spine_vector[1] / spine_length,
			spine_vector[2] / spine_length
		};
		return spine_axis;
	},
	
/* Function findAxis_width : Returns a unit vector in the direction parallel to shoulder or hip line.
Input joints are spine and the joint connecting the extremity to the core of the skeleton. */
	findAxis_width : function(spineJoint, partJoint, spine_axis) {
		var ref_point = dotproduct(partJoint, spine_axis) * spine_axis;		//Finds the point on the spine where a perpendicular line can be drawn to the part joint
		var side_vector = {						//Direction between spine and part joint
			spineJoint[0] - ref_point[0],
			spineJoint[1] - ref_point[1],
			spineJoint[2] - ref_point[2]
		};
		var side_length = Math.sqrt(Math.pow(side_vector[0], 2) + Math.pow(side_vector[1], 2) + Math.pow(side_vector[2], 2));
		var side_axis = {						//Normalizing the vector by dividing the components by its length
			side_vector[0] / side_length,
			side_vector[1] / side_length,
			side_vector[2] / side_length
		};
		return side_axis;
	},
	
/* Function findAxis_depth: Returns a unit vector in the direction perpendicular to input vectors */
	findAxis_depth : function(spine_axis, side_axis) {
		var depth_vector = crossproduct(spine_axis, side_axis);		//Using cross product of the two identified vectors to find the third one (perpendicular to both)
		var depth_length = Math.sqrt(Math.pow(depth_vector[0], 2) + Math.pow(depth_vector[1], 2) + Math.pow(depth_vector[2], 2));
		var depth_axis = {											//Normalizing the vector by dividing the components by its length
			depth_vector[0] / depth_length,
			depth_vector[1] / depth_length,
			depth_vector[2] / depth_length
		};
		return depth_axis;
	},
	
//Function project: Projects input point onto plane defined by input normal vector (origin 0,0,0 has to be in the plane)
	project : function(point, planeNormal){
		var proj_point = (point - (dotproduct(point, planeNormal)) * planeNormal);
		return proj_point;
	},
	
//Function vectorAngle: Calculates the angles between the bone connecting input arguments and spine in front and side perspectives (as defined by the axis passed)
	vectorAngle : function(node1, node2, relativeAxis, viewAxis1, viewAxis2) {
		var node1_front = project(node1, viewAxis1);		//Projects the limbs in both perpectives
		var node1_side = project(node1, viewAxis2);
		var node2_front = project(node2, viewAxis1);
		var node2_side = project(node2, viewAxis2);
		var v = {								//Vector of limb in front perspective
			node2_front[0] - node1_front[0],
			node2_front[1] - node1_front[1],
			node2_front[2] - node1_front[2]
		};
		var alpha = Math.atan2(dotproduct(relativeAxis, v), dotproduct(viewAxis1, v)) * 2 * PI;	//Angle calculations for first perspective
		v = {									//Changes the vector of limb to use second perspective
			node2_side[0] - node1_side[0],
			node2_side[1] - node1_side[1],
			node2_side[2] - node1_side[2]
		};
		var beta = Math.atan2(dotproduct(relativeAxis, v), dotproduct(viewAxis2, v)) * 2 * PI;	//Angle calculations for second perspective
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