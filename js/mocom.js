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
		var bodypart = $("#bodypart").find(":selected").attr("data-bodypart");

		var neededJoint = [];
		var takeAPosition = [];
		var takeBPosition = [];
		switch(bodypart){
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
		fileHandler.loadDataTrack(urlA, function(){
			movan.callbackForData();
			// get the start frame index, length
			// different framerates (of takeA and takeB) might cause proublem later, but since we mostly consider takes in a same project so we ignore it for now.
			var frametimeA = movan.dataTracks[0].content.frameTime;
			var startFrameA = Math.floor(starttimeA / frametimeA);
			var endFrameA = startFrameA + Math.floor(duration / frameTimeA);
			var jointArray1, jointArray2, jointArray3, jointArray4, jointArray5, jointArray6 = []; //tmp joint holders
			for (var i=startFrameA; i<endFrameA; i++){
				var tmp = [];
				tmp = movan.dataTracks[0].content.jointArray[ neededJoint[0] ].positons[i]; jointArray1.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[0].content.jointArray[ neededJoint[1] ].positons[i]; jointArray2.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[0].content.jointArray[ neededJoint[2] ].positons[i]; jointArray3.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[0].content.jointArray[ neededJoint[3] ].positons[i]; jointArray4.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[0].content.jointArray[ neededJoint[4] ].positons[i]; jointArray5.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[0].content.jointArray[ neededJoint[5] ].positons[i]; jointArray6.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
			}
			takeAPosition = [jointArray1, jointArray2, jointArray3, jointArray4, jointArray5, jointArray6];
		});

		fileHandler.loadDataTrack(urlB, function(){
			movan.callbackForData();
			var frametimeB = movan.dataTracks[1].content.frameTime;
			var startFrameB = Math.floor(starttimeA / frametimeB);
			var endFrameB = startFrameB + Math.floor(duration / frameTimeB);
			var jointArray1, jointArray2, jointArray3, jointArray4, jointArray5, jointArray6 = []; //tmp joint holders
			for (var i=startFrameB; i<endFrameB; i++){
				var tmp = [];
				tmp = movan.dataTracks[1].content.jointArray[ neededJoint[0] ].positons[i]; jointArray1.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[1].content.jointArray[ neededJoint[1] ].positons[i]; jointArray2.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[1].content.jointArray[ neededJoint[2] ].positons[i]; jointArray3.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[1].content.jointArray[ neededJoint[3] ].positons[i]; jointArray4.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[1].content.jointArray[ neededJoint[4] ].positons[i]; jointArray5.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );
				tmp = movan.dataTracks[1].content.jointArray[ neededJoint[5] ].positons[i]; jointArray6.push( {x:tmp[0], y:tmp[1], z:tmp[2]} );		}
			takeBPosition = [jointArray1, jointArray2, jointArray3, jointArray4, jointArray5, jointArray6];
		});
	}


};