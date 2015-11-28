// input: 
// TakeAPosition[
// 	jointArray1[{x:0, y:0, z:0},{},{},...],     "Root" joint (center shoulder or center hip
// 	jointArray2[{x:0, y:0, z:0},{},{},...],		Spine joint
// 	jointArray3[{x:0, y:0, z:0},{},{},...],		"Connecting" joint/body part joint 1 (joint that connects body part to core, right/left shoulder or hip
// 	jointArray4[{x:0, y:0, z:0},{},{},...],		Body part joint 2 (elbow or knee)
// 	jointArray5[{x:0, y:0, z:0},{},{},...],		Body part joint 3 (wrist or ankle)
// 	jointArray6[{x:0, y:0, z:0},{},{},...]		Body part joint 4 (hand or foot)
// ]
// TakeBPosition[
// 	jointArray1[{x:0, y:0, z:0},{},{},...],
// 	jointArray2[{x:0, y:0, z:0},{},{},...],
// 	jointArray3[{x:0, y:0, z:0},{},{},...],
// 	jointArray4[{x:0, y:0, z:0},{},{},...],
// 	jointArray5[{x:0, y:0, z:0},{},{},...],
// 	jointArray6[{x:0, y:0, z:0},{},{},...]
// ]

// output:
// TakeAAngle[
// 	jointArray1[{alpha:0, beta:0},{},...],
// 	jointArray2[{alpha:0, beta:0},{},...],
// 	jointArray3[{alpha:0, beta:0},{},...]
// ]
// TakeBAngle[
// 	jointArray1[{alpha:0, beta:0},{},...],
// 	jointArray2[{alpha:0, beta:0},{},...],
// 	jointArray3[{alpha:0, beta:0},{},...]
// ]

var angleData = {

	convertData : function(jointPositions){
		var jointAngles = new Array(3);
		jointAngles[0] = new Array(jointPositions[0].length;
		jointAngles[1] = new Array(jointPositions[0].length;
		jointAngles[2] = new Array(jointPositions[0].length;
		for (var i = 0; i < jointAngles[0].length; i++){
			jointAngles[0][i] = vectorAngle();
			jointAngles[1][i] = vectorAngle();
			jointAngles[2][i] = vectorAngle();			
		}
	}
	translateOrigin : function(newOrigin, 
	spineJoint : {
		0,
		0,
		0
	},
	anchorJoint: {
		0,
		0,
		0
	},
	partJoint: {
		0,
		0,
		0
	},
	spineJoint -= anchorJoint;
	partJoint -= anchorJoint;
	var spine_axis = findAxis_spine(spineJoint, anchorJoint);
	var side_axis = findAxis_side(spineJoint, partJoint);
	var depth_axis = findAxis_depth(spine_axis, side_axis);
	var spine_proj_front = {
		project(spineJoint[0], depth_axis),
		project(spineJoint[1], depth_axis),
		project(spineJoint[2], depth_axis)
	}
	var anchor_proj_front = {
		project(anchorJoint[0], depth_axis),
		project(anchorJoint[1], depth_axis),
		project(anchorJoint[2], depth_axis)
	}
	var part_proj_front = {
		project(partJoint[0], depth_axis),
		project(partJoint[1], depth_axis),
		project(partJoint[2], depth_axis)
	}
	var spine_proj_side = {
		project(spineJoint[0], side_axis),
		project(spineJoint[1], side_axis),
		project(spineJoint[2], side_axis)
	}
	var anchor_proj_side = {
		project(anchorJoint[0], side_axis),
		project(anchorJoint[1], side_axis),
		project(anchorJoint[2], side_axis)
	}
	var part_proj_side = {
		project(partJoint[0], side_axis),
		project(partJoint[1], side_axis),
		project(partJoint[2], side_axis)
	}

/* Function findAxis_width : Returns a unit vector in the direction parallel to shoulder or hip line.
Input joints are spine and the joint connecting the extremity to the core of the skeleton. */
	findAxis_spine : function(spineJoint, anchorJoint) {
		var spine_vector = {
			anchorJoint[1] - spineJoint[1],
			anchorJoint[0] - spineJoint[0],
			anchorJoint[2] - spineJoint[2]
		};
		var spine_length = Math.sqrt(Math.pow(spine_vector[0], 2) + Math.pow(spine_vector[1], 2) + Math.pow(spine_vector[2], 2));
		var spine_axis = {
			spine_vector[0] / spine_length,
			spine_vector[1] / spine_length,
			spine_vector[2] / spine_length
		};
		return spine_axis;
	},
	
/* Function findAxis_width : Returns a unit vector in the direction parallel to shoulder or hip line.
Input joints are spine and the joint connecting the extremity to the core of the skeleton. */
	findAxis_width : function(spineJoint, partJoint) {
		var ref_point = dotproduct(partJoint, spine_axis) * spine_axis;
		var side_vector = {
			spineJoint[1] - ref_point[1],
			spineJoint[0] - ref_point[0],
			spineJoint[2] - ref_point[2]
		};
		var side_length = Math.sqrt(Math.pow(side_vector[0], 2) + Math.pow(side_vector[1], 2) + Math.pow(side_vector[2], 2));
		var side_axis = {
			side_vector[0] / side_length,
			side_vector[1] / side_length,
			side_vector[2] / side_length
		};
		return side_axis;
	},
	
/* Function findAxis_depth: Returns a unit vector in the direction perpendicular to input vectors */
	findAxis_depth : function(spine_axis, side_axis) {
		var depth_vector = crossproduct(spine_axis, side_axis);
		var depth_length = Math.sqrt(Math.pow(depth_vector[0], 2) + Math.pow(depth_vector[1], 2) + Math.pow(depth_vector[2], 2));
		var depth_axis = {
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
	vectorAngle : function(firstNode, secondNode, relativeAxis, viewAxis1, viewAxis2) {
		var v = {
			secondNode[0] - firstNode[0],
			secondNode[1] - firstNode[1],
			secondNode[2] - firstNode[2]
		};
		var alpha = Math.atan2(dotproduct(relativeAxis, v), dotproduct(viewAxis1, v)) * 2 * PI;
		var beta = Math.atan2(dotproduct(relativeAxis, v), dotproduct(viewAxis2, v)) * 2 * PI;
		return { alpha, beta };
	},
	
//Function to calculate the scalar product of vector a and b, returns scalar n
	dotproduct : function(a,b) {
		var n = 0, lim = Math.min(a.length,b.length);
		for (var i = 0; i < lim; i++) {
			n += a[i] * b[i];
		}
		return n;
	},
	
//Function to calculate the vector product of vector a and b, returns vector c
	crossproduct : function(a,b) {							
		var c = new Array(3);
		c[0] =   ((a[1] * b[2]) - (a[2] * b[1]));
		c[1] = - ((a[0] * b[2]) - (a[2] * b[0]));
		c[2] =   ((a[0] * b[1]) - (a[1] * b[0]));
		return c;
	}
}