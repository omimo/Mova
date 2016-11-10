/**
 * 
 */

var fileHandler = fileHandler || {};

fileHandler.loadDataTrack = function (url, callback) {
	
	
	// if file is bvh
	console.log(">"+url);
	reader = new BVHReader;
	reader.load(url,callback);
	//console.log(reader);
	//console.log(BVHReader.load);
	//BVHReader.load(url,callback);
	
};

fileHandler.loadTake = function () {
	//get all the tracks in the take
	//add them into the movan.allTracks
	//look at the extensions and call the loadDataTrack for the ones we can handle
	
	// .bvh .mp4 .avi . mov .aiff . mp3  .annotation? 
	
};

