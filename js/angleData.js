var angleData = {
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
	project : function(point, planeNormal){
		var proj_point = (point - (dotproduct(point, planeNormal)) * planeNormal);
		return proj_point;
	},
	vectorAngle : function(firstNode, secondNode) {
		var v = {
			secondNode[0] - firstNode[0],
			secondNode[1] - firstNode[1],
			secondNode[2] - firstNode[2]
		};
		var alpha = Math.atan2(dotproduct(spine_axis, v), dotproduct(side_axis, v)) * 2 * PI;
		var beta = Math.atan2(dotproduct(spine_axis, v), dotproduct(depth_axis, v)) * 2 * PI;
	},
	dotproduct : function(a,b) {
		var n = 0, lim = Math.min(a.length,b.length);
		for (var i = 0; i < lim; i++) {
			n += a[i] * b[i];
		}
		return n;
	},
	crossproduct : function(a,b) {
		var c = new Array(3);
		c[0] =   ((a[1] * b[2]) - (a[2] * b[1]));
		c[1] = - ((a[0] * b[2]) - (a[2] * b[0]));
		c[2] =   ((a[0] * b[1]) - (a[1] * b[0]));
		return c;
	}
}