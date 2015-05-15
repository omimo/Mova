$(function(){
  $("#add-category-btn").on("click", function(){
    var newCategory = $("#annotation-search-field").val().trim();
    if(newCategory != ""){
      // check if the label exists already
      var items = $("#jqxTree").jqxTree('getItems');
      for(var i in items){
        var item = items[i];
        if(item.label.toLowerCase() == newCategory){
          alert("Cannot add "+ newCategory + ". It already exists.");
          return;
        }
      }
      $("#jqxTree").jqxTree('addTo', {label: newCategory});
    }
    $("#annotation-search-field").val("");
  });

  $("#annotation-search-field").on("keyup", function(event){
    // preventing event propagating as pressing the 'd' key will delete the segment
    event.stopPropagation();

    var text2Search = $("#annotation-search-field").val().trim();
    if(text2Search == ""){
      text2Search = "!!!";
      $("#jqxTree").jqxTree('selectItem', null);
      $("#jqxTree").jqxTree('collapseAll');
    }
    $("#jqxTree").jqxTree('collapseAll');
    var items = $("#jqxTree").jqxTree('getItems');
    for(var i in items){
      var item = items[i];
      if(item.label.toLowerCase().indexOf(text2Search.toLowerCase()) > -1){
        $("#jqxTree").jqxTree('expandItem', item.element);
        $(item.element).find("div:first").addClass("search-result");
      }else{
        $(item.element).find("div:first").removeClass("search-result");
      }
    }
  });

  $("#jqxTree").on('select', function(event){
    // remove hierarchy from all Elements
    var items = $('#jqxTree').jqxTree('getItems');
    for(var i in items){
      var item = items[i];
      $(item.element).find("div:first").removeClass("jqx-fill-state-pressed");
    }

    var current = $('#jqxTree').jqxTree('getItem', event.args.element);
    while(current != null){
      console.log(current);
      $(current.element).find("div:first").addClass("jqx-fill-state-pressed");
      current = $('#jqxTree').jqxTree('getItem', current.parentElement);
    }
  });

  //create the slider for timeZoomRatio
  $("#timeZoomRatioSlider").jqxSlider({
    tooltip: true,
    min: 0.01,
    max: 1,
    step: 0.1,
    ticksFrequency: 0.1,
    value: 1
  });

  $('#timeZoomRatioSlider').on('change', function (event) {
    timeZoomRatio = event.args.value;
    redrawAnnotationArea();
  });

  $(window).resize(redrawAnnotationArea);

});

function redrawAnnotationArea(){
  //update width of SVG
  var width = $("#annotation-area").width();
  svgContainerWidth = (width /  timeZoomRatio) - 20;
  d3.select("#svg-container").attr("width", svgContainerWidth);

  //update timeScale
  timeScale.range([25, svgContainerWidth - 25])

  //redraw the player scrubber
  scrubberAxis.call(axis);

  //redraw brushes
  for(var i in brushes){
    brushes[i].redraw();
  }
}

function initAnnotation(){

  // the category data is loaded from a javascript. REFACTOR: make category data a json file and load
  // it using AJAX
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

  timeZoomRatio = 1;
  var width = $("#annotation-area").width();
  svgContainerWidth = (width /  timeZoomRatio) - 20;

  var svgContainer = d3.select("#svg-container").attr("width", svgContainerWidth);

  timeScale = d3.scale.linear()
                  .domain([0, state.maxTime])
                  .range([25, svgContainerWidth - 25])
                  // .clamp(true); //do not clamp as the segment drag relies on timeScale generating out of range values

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