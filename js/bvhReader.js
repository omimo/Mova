// 


var BVHReader = function () {

    this.load = function (url, callback) {
        $.get(url, function (str) {
            var dataReturn = parse(str);            
            var jointStack = dataReturn[0];
            var jointMap = dataReturn[1];
            var jointArray = dataReturn[2];
            if (callback)
                callback(new BVHReader.BVH.Skeleton(jointStack[0], jointMap, jointArray, dataReturn[3], dataReturn[4], dataReturn[5]),'BVH');
        });
    };
    
    function parse(str) {
        var lines = str.split('\n');
        var jointStack = [];
        var jointMap = {};
        var jointArray = [];
        var frameCount, frameTime, frameArray = [];
        var i = 0;
        //parse structure
        for (i = 1; i < lines.length; i++) {
            if (!parseLine(lines[i], jointStack, jointMap, jointArray)) {
                break;
            }
        }

        for (i = i + 1; i < lines.length; i++) {
            var line = lines[i].trim();
            //when encountering last line
            if (line === "")
                break;
            if (line.indexOf("Frames") === 0) {
                frameCount = +(line.split(" ")[1]);
            } else if (line.indexOf("Frame Time") === 0) {
                frameTime = +(line.split(" ")[2]);
            } else {
                var parts = line.split(" ");
                for (var j = 0; j < parts.length; j++)
                    parts[j] = +parts[j];
                frameArray.push(parts);
            }
        }

        //parse motion
        return [jointStack, jointMap, jointArray, frameCount, frameTime, frameArray];
    }

    var parseLine = function (line, jointStack, jointMap, jointArray) {
        line = line.trim();
        if (line.indexOf("ROOT") > -1 || line.indexOf("JOINT") > -1 || line.indexOf("End") > -1) {
            var parts = line.split(" ");
            var joint = new BVHReader.BVH.Joint(parts[1]);
            jointStack.push(joint);
            if (line.indexOf("End") < 0) {
                joint.jointIndex = Object.keys(jointMap).length;
                jointMap[parts[1]] = joint;
                jointArray.push(joint);
                if (jointArray.length == 1) {
                    joint.channelOffset = 0;
                } else {
                    joint.channelOffset = jointArray[jointArray.length - 2].channelOffset + jointArray[jointArray.length - 2].channelLength;
                }
            }
        } else if (line.indexOf("{") === 0) {

        } else if (line.indexOf("OFFSET") === 0) {
            var parts = line.split(" ");
            jointStack[jointStack.length - 1]["offset"] = parts.slice(1);
        } else if (line.indexOf("CHANNELS") === 0) {
            var parts = line.split(" ");
            jointStack[jointStack.length - 1]["channelNames"] = parts.slice(2);
            jointStack[jointStack.length - 1]["channelLength"] = +parts[1];
        } else if (line.indexOf("}") === 0) {
            if (jointStack.length > 1) {
                child = jointStack.pop();
                jointStack[jointStack.length - 1].children.push(child);
                child.parent = jointStack[jointStack.length - 1];
            }
        } else if (line.indexOf("MOTION") == 0) {
            return false;
        }

        return true;
    };
};

BVHReader.BVH = BVHReader.BVH || {};

BVHReader.BVH.Joint = function (name) {
    this.name = name;
    this.children = [];
    this.isEndSite = function () {
        return name === "Site";
    };
    this.rotationIndex = function () {
        console.log("Not implemented");
    };
    this.positionIndex = function () {
        console.log("Not implemented");
    };
    this.getChannels = function () {
        var allChannels = [];
        for (i = 0; i < this.frameArray.length; i++) {
            allChannels.push(this.getChannelsAt(i));
        }
        return allChannels;
    };
    this.getChannelsAt = function (frameNum) {
        var channelsAtFrame = this.skeleton.frameArray[frameNum];
        return channelsAtFrame.slice(this.channelOffset, this.channelOffset + this.channelLength);
    };
};

BVHReader.BVH.Skeleton = function (root, map, arr, frameCount, frameTime, frameArray) {
    thisSkeleton = this;
    this.root = root;
    this.jointMap = map;
    this.jointArray = arr;
    this.frameCount = frameCount;
    this.frameTime = frameTime;
    this.frameArray = frameArray;

    for (i = 0; i < this.jointArray.length; i++) {
        this.jointArray[i].skeleton = thisSkeleton;
    }

    this.getChannels = function () {
        return frameArray;
    };
    this.getChannelsAt = function (frameNum) {
        return frameArray[frameNum];
    };
    this.getFrameRate = function () {
        return frameCount / frameTime;
    };
    this.getSkeleton = function () {
        return root;
    };
    this.getTPose = function () {
        console.log("Not yet implemented");
    };
};