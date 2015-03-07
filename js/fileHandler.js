/**
 * 
 */

var fileHandler = fileHandler || {};

fileHandler.loadDataTrack = function (url, callback) {
	
	
	// if file is bvh
	
	reader = new BVHReader;
	reader.load(url,callback);
	//console.log(reader);
	//console.log(BVHReader.load);
	//BVHReader.load(url,callback);
	
};