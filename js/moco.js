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
	urlA		: "",

	starttimeA	: 0,

	urlB		: "",

	starttimeB	: 0,

	duration	: 0,

	bodypart	: 0,

	takeAOrig 	: [],

	takeBOrig	: [],

	takeAPosition : [],

	takeBPosition : [],

	takeAAngles : [],

	takeBAngles : [],

	// load original takes (tackAOrig, takeBOrig)
	loadTakes : function(){
        // $.get(this.urlA, function (str) {
        //     takeAOrig = parse(str);
        // });
        // $.get(this.urlB, function (str) {
        //     takeBOrig = parse(str);
        // });
        console.log("hi there!!!");
	},

	extractTakeClips : function(){},
	generatePositions : function(){},



};