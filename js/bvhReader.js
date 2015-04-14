// By Ankit
var BVHReader = function () {

    this.load = function (url, callback) {
        $.get(url, function (str) {
            var dataReturn = parse(str);
            var jointStack = dataReturn[0];
            var jointMap = dataReturn[1];
            var jointArray = dataReturn[2];
            var connectivityMatrix = dataReturn[3]
            if (callback)
                callback(new BVHReader.BVH.Skeleton(jointStack[0], jointMap, jointArray, dataReturn[3], dataReturn[4], dataReturn[5], dataReturn[6]),'BVH');
        });
    };

    function parse(str) {
        var lines = str.split('\n');
        var jointStack = [];
        var jointMap = {};
        var jointArray = [];
        var connectivityMatrix = [];
        var frameCount, frameTime, frameArray = [];
        var i = 0;
        //parse structure
        for (i = 1; i < lines.length; i++) {
            if (!parseLine(lines[i], jointStack, jointMap, jointArray, connectivityMatrix)) {
                break;
            }
        }

        for (i = i + 1; i < lines.length; i++) {
            var line = lines[i].trim();
            //when encountering last line
            if (line === "")
                break;
            if (line.indexOf("Frames") === 0) {
                frameCount = +(line.split(/\b/)[2]);
            } else if (line.indexOf("Frame Time") === 0) {
                frameTime = +( line.substr(line.indexOf(":") + 1).trim() )
            } else {
                var parts = line.split(" ");
                for (var j = 0; j < parts.length; j++)
                    parts[j] = +parts[j];
                frameArray.push(parts);
            }
        }

        //parse motion
        return [jointStack, jointMap, jointArray, connectivityMatrix, frameCount, frameTime, frameArray];
    }

    //parses individual line in the bvh file.
    var parseLine = function (line, jointStack, jointMap, jointArray, connectivityMatrix) {
        line = line.trim();
        if (line.indexOf("ROOT") > -1 || line.indexOf("JOINT") > -1 || line.indexOf("End") > -1) {
            var parts = line.split(" ");
            var title = parts[1]; //temporary variable to be used after creating the joint object
            parts[1] = parts[1] + "-" + jointArray.length;
            var joint = new BVHReader.BVH.Joint(parts[1]);
            joint.title = title;
            jointStack.push(joint);

            joint.jointIndex = Object.keys(jointMap).length;
            jointMap[parts[1]] = joint;
            jointArray.push(joint);
            //if the joint is not an end site
            if( line.indexOf("End") != 0 ){
                if (jointArray.length == 1) {
                    joint.channelOffset = 0;
                } else {
                    joint.channelOffset = jointArray[jointArray.length - 2].channelOffset + jointArray[jointArray.length - 2].channelLength;
                }
            }else{
                //channelLength is 0 for end joints
                joint.channelLength = 0;
                joint.channelOffset = jointArray[jointArray.length - 2].channelOffset + jointArray[jointArray.length - 2].channelLength;
            }

        } else if (line.indexOf("{") === 0) {

        } else if (line.indexOf("OFFSET") === 0) {
            var parts = line.split(" ");
            jointStack[jointStack.length - 1]["offset"] = parts.slice(1);
            for(x in jointStack[jointStack.length - 1]["offset"]){
                jointStack[jointStack.length - 1]["offset"][x] = +jointStack[jointStack.length - 1]["offset"][x]
            }
        } else if (line.indexOf("CHANNELS") === 0) {
            var parts = line.split(" ");
            jointStack[jointStack.length - 1].setChannelNames(parts.slice(2));
            jointStack[jointStack.length - 1]["channelLength"] = +parts[1];
        } else if (line.indexOf("}") === 0) {
            if (jointStack.length > 1) {
                child = jointStack.pop();
                jointStack[jointStack.length - 1].children.push(child);
                child.parent = jointStack[jointStack.length - 1];

                connectivityMatrix.push([child.parent, child])

                // if(!connectivityMatrix[child.name]){
                //     connectivityMatrix[child.name] = {}
                // }
                // connectivityMatrix[child.name][child.parent.name] = 1;

                // if(!connectivityMatrix[child.parent.name]){
                //     connectivityMatrix[child.parent.name] = {}
                // }
                // connectivityMatrix[child.parent.name][child.name] = 1;
            }
        } else if (line.indexOf("MOTION") == 0) {
            return false;
        }

        return true;
    };
};

BVHReader.BVH = BVHReader.BVH || {};

BVHReader.BVH.Joint = function (name, index) {

    this.name = name;
    this.children = [];
    this.isEndSite = function () {
        return this.children.length == 0;
    };
    this.rotationIndex = {};
    this.positionIndex = {};

    this.getChannels = function () {
        var allChannels = [];
        for (i = 0; i < this.skeleton.frameArray.length; i++) {
            allChannels.push(this.getChannelsAt(i));
        }
        return allChannels;
    };
    this.getChannelsAt = function (frameNum) {
        var channelsAtFrame = this.skeleton.frameArray[frameNum];
        return channelsAtFrame.slice(this.channelOffset, this.channelOffset + this.channelLength);
    };

    this.setChannelNames = function (nameArr){
        this.channelNames = nameArr;
        for(i in this.channelNames){
            var name = this.channelNames[i];
            switch(name){
                case "Xposition": this.positionIndex.x = i; break;
                case "Yposition": this.positionIndex.y = i; break;
                case "Zposition": this.positionIndex.z = i; break;

                case "Xrotation": this.rotationIndex.x = i; break;
                case "Yrotation": this.rotationIndex.y = i; break;
                case "Zrotation": this.rotationIndex.z = i; break;
            }
        }
    }
};

BVHReader.BVH.Skeleton = function (root, map, arr, connectivityMatrix, frameCount, frameTime, frameArray) {
    thisSkeleton = this;
    this.root = root;
    this.jointMap = map;
    this.jointArray = arr;
    this.connectivityMatrix = connectivityMatrix;
    this.frameCount = frameCount;
    this.frameTime = frameTime;
    this.frameArray = frameArray;

    for (i = 0; i < this.jointArray.length; i++) {
        this.jointArray[i].skeleton = thisSkeleton;
    }

    //all the structures are ready. let's calculate the positions
    for(j=0; j < this.jointArray.length; j++){
        var joint = this.jointArray[j];
        updateWithPositions(joint);
    }

    this.getChannels = function () {
        return frameArray;
    };
    this.getChannelsAt = function (frameNum) {
    	//How do I know which column is what?
        //Why do you need the column index?
        return frameArray[frameNum];
    };
    this.getFrameRate = function () {
        return frameCount / frameTime;
    };
    this.getSkeleton = function () {
        return root;
    };

    this.getHeadJoint = function () {
    	// do a quick search in the joint names to see if any of them matches head, else return the something!!!!
        return jointMap["Head"];
    };
    this.getPositionsAt = function (frameNum) {
    	//for each joint, calculate its position in XYZ
        //return an array of joints, each with .x, .y, and .z properties
    	posFrame = [];

    	for (j=0;j<this.jointArray.length;j++) {
    		posFrame.push(this.jointArray[j].positions[frameNum]);
    	}

    	posFrame = posFrame.map(function(d) {
			return {
				x : d[0],
				y : d[1],
				z : d[2],
			};
		});

        return posFrame;
    };
    this.getTPose = function () {
    	// This function is basically the same as the getPositionsAt except that all the rotations will be 0
        console.log("Not yet implemented");
    };

    function updatePositions(rootOffset, removeRoot, orientation, camera) {
      //TODO: compelte the specification of this

      for(j=0; j < this.jointArray.length; j++){
          var joint = this.jointArray[j];
          updateWithPositions(joint);
      }
    }

    function updateWithPositions(joint){
        var channelNames = joint.channelNames;
        joint.channels = joint.getChannels();
        joint.rotations = [];
        joint.positions = [];
        for(i in joint.channels){
            var channel = joint.channels[i];
            var xpos = channel[joint.positionIndex.x] || 0,
            ypos =  channel[joint.positionIndex.y] || 0,
            zpos =  channel[joint.positionIndex.z] || 0,
            xangle =  deg2rad(channel[joint.rotationIndex.x] || 0),
            yangle =  deg2rad(channel[joint.rotationIndex.y] || 0),
            zangle= deg2rad(channel[joint.rotationIndex.z] || 0);

            // var rotMatrix = math.transpose(getRotationMatrix(xangle, yangle, zangle, "xyz"));
            var rotMatrix = getRotationMatrix1(xangle, yangle, zangle, "xyz"); //this also works
            var posMatrix = [xpos, ypos, zpos];

            if(joint.parent){
            	  posMatrix = [0,0,0];  //At least for the bvhs that we have, this should be set to 0

                var t = vectorAdd(joint.offset, posMatrix);
                var u = matrixMultiply(t, joint.parent.rotations[i]);

                joint.positions[i] = vectorAdd(u, joint.parent.positions[i]);
                joint.rotations[i] = matrixMultiply( rotMatrix, joint.parent.rotations[i]);


                 if (i==0 && (joint.name ==  "Spine" || joint.name == "L_Femur")) {
                    /*console.log("head's rot mat: ");
                    console.log(joint.rotations[i]);
                    console.log(t);
                    console.log(u);

                    console.log("x: "+xangle + "y: "+yangle + "z: "+zangle );
                    console.log(posMatrix);
                    */
                }

            }else{
                //its the root
                joint.rotations[i] = rotMatrix;
                joint.positions[i] = posMatrix;//vectorAdd(joint.offset , posMatrix);
                // ^ we can safely ignore the root's offset
            }
        }
    }

    function deg2rad(deg){
        return deg * (Math.PI/180);
    }


    function getRotationMatrix(alpha, beta, gamma) {

    //inputs are the intrinsic rotation angles in RADIANTS
    var ca = Math.cos(alpha),
    	sa = Math.sin(alpha),

    	cb = Math.cos(beta),
    	sb = Math.sin(beta),

    	cg = Math.cos(gamma),
    	sg = Math.sin(gamma),

    Rx = [[1, 0, 0], [0, ca, -sa], [0, sa, ca]];

    Ry = [[cb, 0, sb], [0, 1, 0], [-sb, 0, cb]];

    Rz = [[cg, -sg, 0], [sg, cg, 0], [0,    0,   1]];




    var Rzm = math.matrix(Rz);
    var Rym = math.matrix(Ry);
    var Rxm = math.matrix(Rx);

    var tt = math.multiply(Rzm, Rym);

    return  math.multiply(tt,Rxm).toArray();
    //rotationMatrix = math. //Rz*Ry*Rx;

    //     R = Rx*Ry*Rz;
	}

    function getRotationMatrix1 (xangle, yangle, zangle, order){
        var c1 = Math.cos(xangle),
        c2 = Math.cos(yangle),
        c3 = Math.cos(zangle),
        s1 = Math.sin(xangle),
        s2 = Math.sin(yangle),
        s3 = Math.sin(zangle);

        if(order === undefined || order.trim() === ""){
            order = "zxy";
        }

        var rotMat = [
            [1,0,0],
            [0,1,0],
            [0,0,1]
        ];

        switch(order){
            case "___zxy":
                rotMat = [
                    [c2*c3-s1*s2*s3, c2*s3+s1*s2*c3, -s2*c1],
                    [-c1*s3, c1*c3, s1],
                    [s2*c3+c2*s1*s3, s2*s3-c2*s1*c3, c2*c1]
                ];
            break;
            default:
              for (o in order){
                var axis = order[o];
                var t;
                switch(axis){
                    case "x":
                        t = [
                                [1, 0, 0],
                                [0,  c1, s1],
                                [0, -s1, c1],
                            ]
                        break;
                    case "y":
                        t = [
                                [c2,0,-s2],
                                [0,1,0],
                                [s2,0,c2]
                            ]
                        break;
                    case "z":
                        t = [[c3,s3,0],[-s3,c3,0],[0,0,1]]
                        break;
                }

                rotMat = matrixMultiply(t, rotMat)
              }
          }

        return rotMat;
    }
};

function vectorAdd(a, b){
    return math.add(math.matrix(a), math.matrix(b)).toArray();
}

function matrixMultiply(m1, m2) {
    var a = math.matrix(m1);
    var b = math.matrix(m2);
    return math.multiply(a, b).toArray();
}
