$(function(){
  $("#add-category-btn").on("click", function(){
    var newCategory = $("#annotation-search-field").val().trim();
    if(newCategory != ""){
      $("#jqxTree").jqxTree('addTo', {label: newCategory});
    }
    $("#annotation-search-field").val("");
  })

  $("#annotation-search-field").on("keyup", function(event){
    // preventing event propagating as pressing the 'd' key will delete the segment
    event.stopPropagation();

    var text2Search = $("#annotation-search-field").val().trim();
    if(text2Search == ""){
      text2Search = "!!!";
      $("#jqxTree").jqxTree('selectItem', null);
      $("#jqxTree").jqxTree('collapseAll');
    }
    var items = $("#jqxTree").jqxTree('getItems');
    for(var i in items){
      var item = items[i];
      if(item.label.indexOf(text2Search) > -1){
        $("#jqxTree").jqxTree('selectItem', item.element);
        $(item.element).addClass("search-result");
      }else{
        $(item.element).removeClass("search-result");
      }
    }
  })

})

function initAnnotation(){
var categoryData = [
                {
                    "id": "1",
                    "parentid": "-1",
        "text": "Body",
                    "value": "$2.3"
              },{ "id": "2",
                    "parentid": "-1",
                    "text": "Effort",
                    "value": "$2.3"
                }, {
                    "id": "3",
                    "parentid": "-1",
                    "text": "Space",
                    "value": "$2.3"
                }, {
                    "id": "4",
                    "parentid": "-1",
                    "text": "Shape",
                    "value": "$2.3"
                }, {
                    "id": "5",
                    "parentid": "-1",
                    "text": "Themes",
                    "value": "$2.3"
                },  {
                    "id": "6",
                    "text": "Phrasing",
                    "parentid": "-1",
                    "value": "$2.3"
                }, {
                    "id": "7",
                    "parentid": "2",
                    "text": "Factors",
                    "value": "$2.3"
                    }, {
                    "id": "8",
                    "text": "States",
                    "parentid": "2",
                    "value": "$2.3"
                }, {
                    "id": "9",
                    "text": "Drives",
                    "parentid": "2",
                    "value": "$2.3"
                    }, {
                    "id": "10",
                    "text": "Time",
                    "parentid": "7",
                    "value": "$2.3"
                }, {
                    "id": "11",
                    "text": "Weight",
                    "parentid": "7",
                    "value": "$2.3"
                    }, {
                    "id": "12",
                    "text": "Space",
                    "parentid": "7",
                    "value": "$2.3"
                }, {
                    "id": "13",
                    "text": "Flow",
                    "parentid": "7",
                    "value": "$2.3"
                    }, {
                    "id": "15",
                    "text": "Light",
                    "parentid": "11",
                    "value": "$2.3"
                }, {
                    "id": "16",
                    "text": "Strong",
                    "parentid": "11",
                    "value": "$2.3"
                    }, {
                    "id": "17",
                    "text": "Direct",
                    "parentid": "12",
                    "value": "$2.3"
                }, {
                    "id": "18",
                    "text": "Indirect",
                    "parentid": "12",
                    "value": "$2.3"
                 },{
                    "id": "19",
                    "text": "Bound",
                    "parentid": "13",
                    "value": "$2.3"
               },{
                    "id": "20",
                    "text": "Free",
                    "parentid": "13",
                    "value": "$2.3"
                 },{
                    "id": "21",
                    "text": "Quick",
                    "parentid": "10",
                    "value": "$2.3"
       },{
                    "id": "22",
                    "text": "Sustained",
                    "parentid": "10",
                    "value": "$2.3"

       },{
                    "id": "23",
                    "text": "Mobile",
                    "parentid": "8",
                    "value": "$2.3"

       },{
                    "id": "24",
                    "text": "Stable",
                    "parentid": "8",
                    "value": "$2.3"

       },{
                    "id": "25",
                    "text": "Rhythm",
                    "parentid": "8",
                    "value": "$2.3"

       },{
                    "id": "26",
                    "text": "Remote",
                    "parentid": "8",
                    "value": "$2.3"

       },{
                    "id": "27",
                    "text": "Awake",
                    "parentid": "8",
                    "value": "$2.3"

       },{
                    "id": "28",
                    "text": "Dream",
                    "parentid": "8",
                    "value": "$2.3"

       },{
                    "id": "29",
                    "text": "Action",
                    "parentid": "9",
                    "value": "$2.3"

       },{
                    "id": "30",
                    "text": "Passion",
                    "parentid": "9",
                    "value": "$2.3"

       },{
                    "id": "31",
                    "text": "Spell",
                    "parentid": "9",
                    "value": "$2.3"

       },{
                    "id": "32",
                    "text": "Vision",
                    "parentid": "9",
                    "value": "$2.3"

       },{
                    "id": "33",
                    "text": "Float",
                    "parentid": "29",
                    "value": "$2.3"

       },{
                    "id": "34",
                    "text": "Punch",
                    "parentid": "29",
                    "value": "$2.3"

       },{
                    "id": "35",
                    "text": "Glide",
                    "parentid": "29",
                    "value": "$2.3"

       },{
                    "id": "36",
                    "text": "Slash",
                    "parentid": "29",
                    "value": "$2.3"

       },{
                    "id": "37",
                    "text": "Dab",
                    "parentid": "29",
                    "value": "$2.3"

       },{
                    "id": "38",
                    "text": "Wring",
                    "parentid": "29",
                    "value": "$2.3"

       },{
                    "id": "39",
                    "text": "Flick",
                    "parentid": "29",
                    "value": "$2.3"
       },{
                    "id": "40",
                    "text": "Press",
                    "parentid": "29",
                    "value": "$2.3"

      },{
                    "id": "41",
                    "text": "Impulsive",
                    "parentid": "6",
                    "value": "$2.3"

       },{
                    "id": "42",
                    "text": "Impactive",
                    "parentid": "6",
                    "value": "$2.3"

       },{
                    "id": "43",
                    "text": "Swing",
                    "parentid": "6",
                    "value": "$2.3"

       },{
                    "id": "44",
                    "text": "Vibratory",
                    "parentid": "6",
                    "value": "$2.3"

       },{
                    "id": "45",
                    "text": "Even",
                    "parentid": "6",
                    "value": "$2.3"

       },{
                    "id": "46",
                    "text": "Inner/Outer",
                    "parentid": "5",
                    "value": "$2.3"
       },{
                    "id": "47",
                    "text": "Exertion/Recuperation",
                    "parentid": "5",
                    "value": "$2.3"
      },{
                    "id": "48",
                    "text": "Function/Expression",
                    "parentid": "5",
                    "value": "$2.3"

       },{
                    "id": "49",
                    "text": "Stability/Mobility",
                    "parentid": "5",
                    "value": "$2.3"

       },{
                    "id": "50",
                    "text": "Still Forms",
                    "parentid": "4",
                    "value": "$2.3"

       },{
                    "id": "51",
                    "text": "Modes of Shape Change",
                    "parentid": "4",
                    "value": "$2.3"

       },{
                    "id": "52",
                    "text": "Shape Qualities",
                    "parentid": "4",
                    "value": "$2.3"

       },{
                    "id": "53",
                    "text": "Flick",
                    "parentid": "6",
                    "value": "$2.3"
       },{
                    "id": "54",
                    "text": "Press",
                    "parentid": "6",
                    "value": "$2.3"
      },{
                    "id": "55",
                    "text": "Tetrahedron",
                    "parentid": "50",
                    "value": "$2.3"
       },{
                    "id": "56",
                    "text": "Pin",
                    "parentid": "50",
                    "value": "$2.3"
},{
                    "id": "57",
                    "text": "Ball",
                    "parentid": "50",
                    "value": "$2.3"
       },{
                    "id": "58",
                    "text": "Wall",
                    "parentid": "50",
                    "value": "$2.3"
},{
                    "id": "59",
                    "text": "Screw",
                    "parentid": "50",
                    "value": "$2.3"
       },{
                    "id": "60",
                    "text": "Shape Flow",
                    "parentid": "51",
                    "value": "$2.3"
},{
                    "id": "61",
                    "text": "Directional Movement",
                    "parentid": "51",
                    "value": "$2.3"
       },{
                    "id": "62",
                    "text": "Shaping",
                    "parentid": "51",
                    "value": "$2.3"
},{
                    "id": "63",
                    "text": "Spoke-like",
                    "parentid": "6",
                    "value": "$2.3"
       },{
                    "id": "64",
                    "text": "Arc-like",
                    "parentid": "6",
                    "value": "$2.3"
}
];
  
  // prepare the data
  var categorySource =
  {
      datatype: "json",
      datafields: [
          { name: 'id' },
          { name: 'parentid' },
          { name: 'text' },
          { name: 'value' }
      ],
      id: 'id',
      localdata: categoryData
  };
  var categoryDataAdapter = new $.jqx.dataAdapter(categorySource);
  categoryDataAdapter.dataBind();
  var records = categoryDataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label'}]);
  //End of setup for category browser

  //Main Starts here

  brushes = [];

  width = $("#annotation-area").width() - 20;

  var svgContainer = d3.select("#svg-container").attr("width", width);


  timeScale = d3.scale.linear()
                  .domain([0, state.maxTime])
                  .range([25, width - 25])
                  .clamp(true);

  var trackCounter = 0;

  var trackHeight = 50;

  var sliderHeight = 50;

  //TODO call this once the UI of the tabs is fixed
  initPlayer();

  addPlayerScrubber();

  d3.select("body")
  .on("keyup", function(){
    if(d3.event.keyCode == 68){
      for(i in brushes){
        brushes[i].removeSelected();
      }
    }else if(d3.event.keyCode == 65){
      //check if there is any of the segments selected
      for(var i in brushes){
        var brush = brushes[i];
        if(brush.getSelected() != undefined){
          showAnnotationSelectionUI();  
          break;
        }        
      }      
    }
  });

  console.log("Adding annotation track")
  var listener = function(event, source){
    for(var i in brushes){
      var b = brushes[i];
      if(b != source){
        b.deselectAll();
      }
    }
  }
  brushes.push(new AnnotationTrack(svgContainer, timeScale, {"x":25, "y": 50}, listener));
  brushes.push(new AnnotationTrack(svgContainer, timeScale, {"x":25, "y": 100}, listener));
  brushes.push(new AnnotationTrack(svgContainer, timeScale, {"x":25, "y": 150}, listener));

  $(document).on("contextmenu", ".extent", function(event){
    console.log(this);
    d3.select(this).remove();
    return false;
  })

  $("#annotation-graph-dialog").dialog({
    modal: true,
    autoOpen: false,
    width: "425px",
    buttons: {
      Select: function(){
        for(var b in brushes){
          var annotation = $("#jqxTree").jqxTree('getSelectedItem').label;
          brushes[b].annotateSelected(annotation);
          $("#annotation-graph-dialog").dialog("close");
          brushes[b].redraw();
        }
      }
    }
  });

  function showAnnotationSelectionUI(){
    $("#annotation-graph-dialog").dialog('open');
  }

  function addPlayerScrubber(){

    var slider = d3.svg.brush()
                  .x(timeScale).clamp(true);

    axis = d3.svg.axis().scale(timeScale)
    .tickFormat(function(d){
        // var prefix = d3.formatPrefix(d);
        // return prefix.scale(d);
        var numberOfMinutes = d/60000;
        var numberOfSeconds = (d % 60000)/1000;
        return sprintf("%02d:%02d", numberOfMinutes, numberOfSeconds);
    });


    var gSlider = svgContainer.append("g")
        .attr("class", "slider")
        .call(slider);

    scrubberAxis = gSlider.append("g")
    .attr("transform", "translate(0, "+(sliderHeight/2)+")")
    .attr("class", "axis")
    .call(axis)

    gSlider.selectAll("rect")
    .attr({
      "height": sliderHeight,
      "y": 0,
      "visibility": "hidden"
    })

    scrubHandle = gSlider.append("circle")
        .attr("class", "handle")
        .attr("cx", timeScale(0))
        .attr("cy", sliderHeight/2)
        .attr("opacity", 0.6)
        .attr("r", 9);

    slider.on("brush", function() {
      var value = slider.extent()[0];
      
      if (d3.event.sourceEvent) { // not a programmatic event
        value = timeScale.invert(d3.mouse(this)[0]);
        slider.extent([value, value]);
        state.currentTime = value;
      }

      scrubHandle.attr("cx", timeScale(value));
      scrubLine.attr("x1", timeScale(value));
      scrubLine.attr("x2", timeScale(value));
    })

    scrubLine = svgContainer.append("line")
      .attr({
        "x1": timeScale(0),
        "y1": sliderHeight/2,
        "x2": timeScale(0),
        "y2": 500,
        "stroke": "#ccc"
    })

    state.tickListeners.push({
      tick: function(){
        syncSliderPosition();
      },
      play: function(){

      },
      pause: function(){
        
      }
    })
  }

  function initPlayer(){
    try{
      player = videojs('mp4-video',
        { 
          "width": "auto",
          "height": "auto",
          "preload": "auto"
        },
        function() {
          this.on("ended", videoEnded);
        }
      );
    }
    catch(err){
      console.log("Invalid id for videojs " + err);
    }
  }

  /**
   * This function is called when the video ends
   */
  function videoEnded(){
    clearInterval(intervalId)
  }

  function updateState(){
    state.tick();
  }


  function registerControls(){
    $("#play-btn").on("click", function(){
      // this lines helps get the duration of the video before playing it
      // if(typeof intervalId !== 'undefined'){
      //   clearInterval(intervalId);
      // }

      // // player.currentTime(0)
      // videoDuration = player.duration();

      // //setup the scrubber
      // timeScale.domain([0, player.duration()]);

      // intervalId = setInterval(syncSliderPosition, 15)

      // player.play()
      $("#play-btn").hide();
      $("#pause-btn").show();
      state.setPlaying(true);
      //initialize only once
      if(typeof timeController == 'undefined'){
        timeController = setInterval(updateState, state.tickTime);
      }
    });

    $("#pause-btn").on("click", function(){
      $("#play-btn").show();
      $("#pause-btn").hide();
      state.setPlaying(false);
    })

    $("#download-btn").on("click", function(){
      var annotations = []
      for(var b in brushes){
        annotations.push(brushes[b].getAnnotationData());
      }
      console.log(annotations);
      var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(annotations));
      console.log(data);
      $("#link").html("");
      $('<a href="data:' + data + '" download="data.json">Download Annotations</a>').appendTo('#link');
      $("#link a")[0].click();
    })
  }


  function syncSliderPosition(){
    var time = state.currentTime;
    var position = timeScale(time);
    
    scrubHandle.attr("cx", position);
    scrubLine.attr({
      "x1": position,
      "x2": position
    })
  }

  registerControls();

  $('#jqxTree').jqxTree({ source: records, height: '400px', width: '330px', allowDrag: false, animationShowDuration: 0});
  $('#jqxTree').on('select', function(e){
    var selectedItem = $("#jqxTree").jqxTree('getSelectedItem');

    //collapse previous items
    $("#jqxTree").jqxTree('collapseAll');
    $("#jqxTree").jqxTree('expandItem', selectedItem);
  });

  window.updateTimeScale = function(min, max){
    timeScale.domain([min, max]);
    axis.ticks(max/1000);
    scrubberAxis.call(axis);
  }
}