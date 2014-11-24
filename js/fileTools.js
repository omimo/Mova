function loadData(moveFile, skelFile, callback) {

				//var frames =[];
	// Read the movement
	d3.text(moveFile, function(unparsedData) {
		var data = d3.csv.parseRows(unparsedData);

					// put joints together
					f = data.map(function(d) {
						var joints = [];
						for ( i = 0; i < d.length; i += 3) {
							joints[i / 3] = {
								x : +d[i],
								y : +d[i + 1],
								z : +d[i + 2]
							};
						}

						return joints;
					});
					frames = f;
					

					
					//Read the skeleton
					d3.text(skelFile, function(unparsedData) {
						var data = d3.csv.parseRows(unparsedData);
						var cons = [];
						var count = 0;
						var JointNames = [];
						var skel = [];
						
						for ( j = 0; j < data[0].length; j++) {
							JointNames[j]=data[0][j];
						}
						
						for ( i = 1; i < data.length; i++)
							for ( j = 0; j < data[0].length; j++) {
								if (data[i][j] == 1) {
									cons[count++] = {
										a : i-1,
										b : j
									};
								}

							}

							skel.connections = cons;
							skel.jointNames = JointNames;


						//console.log(frames);
					//	setTimeout(function() {callback(frames,skel);},200);
					callback(f,skel);
				});
	});



}

function loadBvh(bvhMotion, callback) {
	//var frames =[];


	var skeleton = [];
	var JointNames = [];
	var JointRefs = new Object();
	var cons = [];
	var count;

	for (i = 0; i < bvhMotion.nodeList.length; ++i) {
		node = bvhMotion.nodeList[i];
		JointNames[i] = node.id;
		JointRefs[node.id] = i; 
	}

	for (i = 0; i < bvhMotion.nodeList.length; ++i) {
		node = bvhMotion.nodeList[i];

		for (j = 0; j < node.children.length; ++j) {
			var index = JointRefs[node.children[j].id]
			cons[count++] = {
				a : i,
				b : index
			}
		}
	}

	skeleton.connections = cons;
	skeleton.jointNames = JointNames;

	// Read the movement

	// console.log(bvhMotion.nodeList);

	// var frames = bvhMotion.

	var frames = [];

	for (i = 0; i < bvhMotion.numFrames; ++i) {

		var joints = [];

		for (j = 0; j < bvhMotion.nodeList.length; ++j) {
			node = bvhMotion.nodeList[i];

			var state = bvhMotion.at(i + 1);
			var frame = state.of(JointNames[j]);

			joints[j * 3] = frame.offsetX;
			joints[j * 3 + 1] = frame.offsetY;
			joints[j * 3 + 2] = frame.offsetZ;
			console.log
		}

		frames[i] = joints;
	}
	console.log("SKELETON");
	console.log(skeleton);

	callback(frames,skeleton);

};