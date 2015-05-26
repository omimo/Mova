
var setSizes = function() {

  var closeBtnHeight = $("#divider-btn-close i").height();
  if(closeBtnHeight !== 0){
    $("#divider-btn-open img").height(closeBtnHeight);
  }

  //TODO: subtract the size of the annotation track below
  $("#canCont").height($(document).height() - 150 - $("#footer").height());


  if (movan.sidebyside == 1) {
    $("#lefttabs").width(($(document).width() - $("#legends").width() - 60)/2 - 10);
    $("#righttabs").width(($(document).width() - $("#legends").width() - 60)/2 - 10);
    $("#righttabs").show();
  }
  else {
    $("#lefttabs").width(($(document).width() - $("#legends").width() - 70));
    $("#righttabs").hide();
  }

  $("#lefttabs").height($("#canCont").height() - $("#annotation-area").height());
  $("#featureList").height($("#lefttabs").height() - $("#left-tabs-container").height() - 40);
  $("#divider").height($("#lefttabs").height());
  $("#righttabs").height($("#lefttabs").height());
  $("#legends").height($("#canCont").height());

  $("#annotation-area").width($("#canCont").width() - $("#legends").width() - 25);
};

$(document).ready(function() {

  $("#lefttabs").tabs().click(function(event, ui) {
    $("#featureList").scrollLeft(0);
  });

  $("#righttabs").tabs();

  $("#open-close").click(function(event) {
    if (movan.sidebyside == 0) {
      $("#divider-btn-close").show();
      $("#divider-btn-open").hide();

      for(var r in rightPlayers){
        rightPlayers[r].muted(false);
      }

      movan.sidebyside=1;
    }
    else{
      $("#divider-btn-close").hide();
      $("#divider-btn-open").show();

      for(var r in rightPlayers){
        rightPlayers[r].muted(true);
      }

      movan.sidebyside=0;
    }

    setSizes();
  });


  $('#lefttabs').on('tabsactivate', function(event, ui) {
    var containedVideo = $(ui.newPanel).find("video");
    var maxWidth = $("#lefttabs").width() - 20;
    var maxHeight = $("#lefttabs").height() - $("#lefttabs ul").height() - 20;
    if ( containedVideo.length === 1) {
      console.log("maxs " + maxWidth + "  " + maxHeight);
      while(true){
        console.log($(containedVideo).width() + " " + $(containedVideo).height() );
        $(containedVideo).css("width", maxWidth + "px");
        var currentHeight = $(containedVideo).height();
        if(currentHeight < maxHeight){
          break;
        }
        maxWidth = maxWidth - 20;
      }
    }
  });

  $('#righttabs').on('tabsactivate', function(event, ui) {
    var containedVideo = $(ui.newPanel).find("video");
    var maxWidth = $("#righttabs").width() - 20;
    var maxHeight = $("#righttabs").height() - $("#righttabs ul").height() - 20;
    if ( containedVideo.length === 1) {
      console.log("maxs " + maxWidth + "  " + maxHeight);
      while(true){
        console.log($(containedVideo).width() + " " + $(containedVideo).height() );
        $(containedVideo).css("width", maxWidth + "px");
        var currentHeight = $(containedVideo).height();
        if(currentHeight < maxHeight){
          break;
        }
        maxWidth = maxWidth - 20;
      }
    }
  });

  $("#sideAcaccordion").accordion({
    heightStyle : "content"
  });

  $("#sidebar").draggable().tabs({
    collapsible : true,
    active : false
  });


  setSizes();

  $(window).resize(setSizes);

  $("#featureList").scroll(function() {
    $("#figure").scrollLeft($("#featureList").scrollLeft());
  });

  $("#figure").scroll(function() {
    $("#featureList").scrollLeft($("#figure").scrollLeft());
  });

  $("#btnSave").button();
  $("#btnSave").click(function(event) {

  });

  $("#jointDropdown").click(function(event) {
    if ($("#jointChooser").css("display") == "none")
      $("#jointChooser").css("display", "");
    else
      $("#jointChooser").css("display", "none");

    var t = $("#jointDropdown").position().top + $("#jointDropdown").height() + 6;

    $("#jointChooser").css("top", t);
  });

  $("#sldPad2").slider({
    animate : true,
    min : 10,
    max : 70,
    step : 1,
    value : 25,
    change : function(event, ui) {
      movan.reDraw();

    }
  }).slider('pips', {

    first : "label",
    last : "label",
    rest : false,
    suffix : "px",
    //labels: false,
  });

  $("#sldSkip2").slider({
    animate : true,
    min : 5,
    max : 50,
    step : 1,
    value : 5,
    change : function(event, ui) {
      movan.reDraw();
    }
  }).slider('pips', {

    first : "label",
    last : "label",
    rest : false,
    suffix : "",
    //labels: false,
  });

  $("#featDropdown").selectric();

  $("#btnAddFeat").button().click(function(event) {
    var len = movan.selectedFeats.length;
    var sel = $("#featDropdown").val();
    var joint = $("#jointDropdown").attr("selectedJoint");

    track = movan.dataTracks[movan.dataTracks.length - 1].content;

    posFrameArray = [];
    for (f=0;f<track.frameCount;f++) {
      posFrameArray[f] = track.getPositionsAt(f);
    }

    movan.selectedFeats[len] = [];
    movan.selectedFeats[len].id = len;
    movan.selectedFeats[len].featID = sel;
    movan.selectedFeats[len].f = movan.availableFeatures[sel][0];
    //movan.selectedFeats[len].data = movan.availableFeatures[sel][1](posFrameArray, movan.frameSkip, track.jointArray[joint], 0);
    movan.selectedFeats[len].data = movan.availableFeatures[sel][1](posFrameArray, movan.frameSkip, joint, 0);
    movan.selectedFeats[len].joint = track.jointArray[joint];

    movan.reDrawFeat();
  });
});
