<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Mova: Movement Analytics Platform</title>

		<link href="css/style.css" rel="stylesheet"/>
		<link href="jq/css/smoothness/jquery-ui-1.10.3.custom.css" rel="stylesheet"/>
		<link rel="stylesheet" type="text/css" href="jq/css/jquery-ui-slider-pips.css">

		<script type="text/javascript" src="d3/d3.v3.min.js"></script>
		<script type="text/javascript" src="js/math.min.js"></script>


		<script type="text/javascript" src="js/bvhReader.js"></script>
		<script type="text/javascript" src="js/fileHandler.js"></script>
		<script type="text/javascript" src="js/csvMocapReader.js"></script>
		
		<script type="text/javascript" src="js/featureTimelineVis.js"></script>
		<script type="text/javascript" src="js/figureVis.js"></script>
		<script type="text/javascript" src="js/featuresLib.js"></script>		
		<script type="text/javascript" src="js/figureAnim.js"></script>
		<script type="text/javascript" src="js/movan.js"></script>
		<script type="text/javascript" src="js/trajectory.js"></script>

		<script src="jq/jquery-2.0.3.min.js"></script>
		<script src="jq/jquery-ui-1.10.3.custom.min.js"></script>
		<script src="jq/jquery.fileupload.js"></script>
		<script src="jq/jquery.iframe-transport.js"></script>
		<script src="jq/jquery-ui-slider-pips.min.js"></script>
		<script src="jq/jquery.selectric.js"></script>

		<script type="text/javascript" src="js/math.min.js"></script>
		<script type="text/javascript" src="js/jqx-all.js"></script>
		<script type="text/javascript" src="js/annotation-track.js"></script>
		<script type="text/javascript" src="js/annotation.js"></script>
		<script type="text/javascript" src="js/video.js"></script>

		<script>
			(function(i, s, o, g, r, a, m) {
				i['GoogleAnalyticsObject'] = r;
				i[r] = i[r] ||
				function() {
					(i[r].q = i[r].q || []).push(arguments)
				}, i[r].l = 1 * new Date();
				a = s.createElement(o), m = s.getElementsByTagName(o)[0];
				a.async = 1;
				a.src = g;
				m.parentNode.insertBefore(a, m)
			})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

			ga('create', 'UA-46098170-1', 'sfu.ca');
			ga('send', 'pageview');

		</script>
		<script>
			$(document).ready(function() {

				$("#maintabs").tabs().click(function(event, ui) {
					$("#featureList").scrollLeft(0);
				});

				$("#btnPlay").button();
				$("#btnPlay").click(function(event) {
					anim.playAnim = true;
					$("#btnPlay").button('option', 'label', 'Pause');
				});

				$("#sideAcaccordion").accordion({
					heightStyle : "content"
				});

				$("#sidebar").draggable().tabs({
					collapsible : true,
					active : false
				});

				var setSizes = function() {

					$("#canCont").height($(document).height() - 150 - $("#footer").height());
					$("#featureList").height($("#canCont").height() - 290);

					$("#maintabs").width($(document).width() - $("#legends").width() - 60);
					$("#legends").height($("#canCont").height());
				};

				setSizes();

				$(window).resize(setSizes);

				$("#featureList").scroll(function() {
					$("#figure").scrollLeft($("#featureList").scrollLeft());
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
					console.log(t);
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

					movan.selectedFeats[len] = [];
					movan.selectedFeats[len].id = len;
					movan.selectedFeats[len].featID = sel;
					movan.selectedFeats[len].f = movan.availableFeatures[sel][0];
					movan.selectedFeats[len].data = movan.availableFeatures[sel][1](movan.gframes, movan.frameSkip, joint, 0);
					movan.selectedFeats[len].joint = joint;

					movan.reDrawFeat();
				});

				/**		
				 * Source : http://stackoverflow.com/questions/814613/how-to-read-get-data-from-a-url-using-javascript
				 */
				function parseURLParams(url) {
			        var queryStart = url.indexOf("?") + 1,
			            queryEnd   = url.indexOf("#") + 1 || url.length + 1,
			            query = url.slice(queryStart, queryEnd - 1),
			            pairs = query.replace(/\+/g, " ").split("&"),
			            parms = {}, i, n, v, nv;
			    
			        if (query === url || query === "") {
			            return;
			        }
			    
			        for (i = 0; i < pairs.length; i++) {
			            nv = pairs[i].split("=");
			            n = decodeURIComponent(nv[0]);
			            v = decodeURIComponent(nv[1]);
			    
			            if (!parms.hasOwnProperty(n)) {
			                parms[n] = [];
			            }
			    
			            parms[n].push(nv.length === 2 ? v : null);
			        }
			        return parms;
		    	}
			    
			    function apiCall(url, cbk){
			      $.ajax({
			         type: "GET",
			         url: url,
			         success: cbk
			      });
			    }
					
				var params = parseURLParams(document.URL);
				
				var take_id = params["take_id"][0];
				var url = "/takes/"+take_id+".json";
				
				apiCall(url, function(data){
				  var data_tracks = data.data_tracks;
				  var bvhFiles = [];
				  var c3dFiles = [];
				  var movFiles = [];
				  var mp4Files = [];
				  data_tracks.forEach(function(d){
				  	console.log(d)
				    if(d.data_track_url.indexOf("bvh.json") > -1){
				      bvhFiles.push(d.data_track_url);
				    }else if(d.data_track_url.indexOf("c3d.json") > -1){
				    	c3dFiles.push(d.data_track_url);
				    }else if(d.data_track_url.indexOf("mp4.json") > -1){
				    	mp4Files.push(d.data_track_url)
				    }else if(d.data_track_url.indexOf("mov.json") > -1){
				    	movFiles.push(d.data_track_url)
				    }

				  })
				  
				  if(bvhFiles.length > 0){
				    //for now do it just for the first one
				    apiCall(bvhFiles[0], function(data){
				      var asset_url = data.asset_url;
				      bvhData = new BVHReader().load(asset_url, showBVH)
				    })
				  }

				  if(movFiles.length > 0){
				    //for now do it just for the first one
				    apiCall(movFiles[0], function(data){
				      var asset_url = data.asset_url;
				      console.log("Setting mov video: " + asset_url)
				      video = $("#mov-video")[0];
				      video.innerHTML = '<source type="video/mov" src="'+asset_url+'">';
				    })
				  }


				  if(mp4Files.length > 0){
				    //for now do it just for the first one
				    apiCall(mp4Files[0], function(data){
				      var asset_url = data.asset_url;
				      console.log("Setting mp4 video: " + asset_url)
				      video = $("#mp4-video")[0];
				      video.innerHTML = '<source type="video/mp4" src="'+asset_url+'">';
				    })
				  }
				});

				initAnnotation();

			});
		</script>

		<style>
	    .track{
	      opacity: .5;
	    }

	    .segment{
	      cursor: move;
	      opacity: .3
	    }

	    rect.selected{
	      fill: red;
	    }

	    .background{
	      fill: yellow;
	      opacity: .7;
	    }

	    .brush{
	      opacity: .5;
	    }

	    .slider .handle {
	      fill: #fff;
	      stroke: #000;
	      stroke-opacity: .5;
	      stroke-width: 1.25px;
	      cursor: crosshair;
	    }

	    rect.selected-ex{
	      fill: orange;
	    }
		</style>
	</head>
	<body>

		<div id="header" style="clear:both;">
			<h1 style="float: left;">Mova: Movement Analytics Platform</h1>
			<h4 style="float: right;">Version 0.5 - Testing    |   <a href="Mova_Intro.mov" target="_blank">Video Intro</a></h4>
		</div>

		<div id="canCont">
			<div id="maintabs">
				<ul>
					<li>
						<a href="#figure">Figure Sketch</a>
					</li>
					<li>
						<a href="#anim">Animation</a>
					</li>
					<li>
						<a href="#mp4">MP4</a>
					</li>
					<li>
						<a href="#mov">MOV</a>
					</li>
				</ul>
				<div id="anim">
					<button id="btnPlay">
						&nbsp;Play&nbsp;&nbsp;
					</button>
				</div>
				<div id="figure">

				</div>

				<div id="mp4">
					<video id="mp4-video" controls>
					    
				    </video>	
				</div>

				<div id="mov">
					<video id="mov-video" controls>
					    
				    </video>	
				</div>
			
				<div id="featureList">

				</div>
			</div>
			<div id="legends">
				<div style="font-family: Verdana, Arial, sans-serif;font-weight: bold;font-size: 11.5pt;padding-bottom: 5px;">
					Legends:
				</div>
			</div>
		</div>
		<div id="annotation-area">
		    <svg id="svg-container" width="500" height="300">

		    </svg>


		    <div id="annotation-graph-dialog">
		        <div id='jqxTree'>
		        </div>
		    </div>
		</div>


		<div id="sidebar">
			<ul class="tooboxTitle">
				<li class="toolboxTitleText">
					<a href="#sideAcaccordion"><img class="ui-icon ui-icon-circle-triangle-s"/> Toolbox</a>
				</li>
			</ul>
			<div id="sideAcaccordion">
				<h2>Files</h2>
				<div id="filelist" class="sidetab">

					<div class="sidetabtitle">
						Upload a file:
					</div>

					<input id="fileupload" type="file" name="files[]" data-url="http://cgi.sfu.ca/~oalemi/movan/srv/upload.php" multiple/>

					<div style="margin-top:5px" class="sidetabtitle">
						Select a file:
					</div>
					<select name="drop1" id="fileSelect" size="4" multiple="multiple"
					onchange="movan.loadNew()" style="border:2px solid #ccc; width:200px; height: 120px; overflow-y: auto;">
					 <option value="KAREN_BEAS_001.csv" selected="selected">KAREN_BEAS_001.bvh</option> 
						<option value="Punch4.csv">Punch4.bvh</option>
						<option value="Float4.csv">Float3.bvh</option>
						<option value="Dab1.csv">Dab1.bvh</option>
						<option value="Flick1.csv">Flick1.bvh</option>
						<option value="Slash4.csv">Slash4.bvh</option>
						<option value="Glide3.csv">Glide3.bvh</option>
						<option value="Wring2.csv">Wring2.bvh</option>
					</select>

				</div>

				<h2>Features</h2>
				<div id="features" class="sidetab">

					<div class="sidetabtitle" style="margin-top:0.5em">
						Select a joint:
					</div>

					<div id="jointDropdown" class="ui-widget ui-widget-content ui-state-default ui-corner-all"
					style="">
						<p id = "jointLabel">
							-
						</p>
						<b id = "jointDropDownArrow" style2="float:right;margin-top:0.5em" class2="ui-icon ui-icon-circle-triangle-s">&#9662;</b>
						<div id="jointChooser" style="display:none;position:absolute;width:198px;z-index:10">

						</div>
					</div>

					<div class="sidetabtitle">
						Select a feature:
					</div>

					<select id="featDropdown"></select>

					<button type="button" id="btnAddFeat">
						Add
					</button>

				</div>

				<h2>Visual Controls</h2>
				<div id="controls" class="sidetab">
					<div class="sidetabtitle">
						Skip Frames:
					</div>

					<div id="sldSkip2" class="slider"></div>

					<div class="sidetabtitle">
						Padding:
					</div>

					<div id="sldPad2" class="slider"></div>
					<br/>

					<div id="sldTest" class="slider"></div>
					<br/>
					<button id="btnSave">
						Save as SVG
					</button>
				</div>
			</div>
		</div>

		<script type="text/javascript">
			
			d3.timer(anim.drawFigure, 15);

		<?php
			if(isset($_GET["group_id"])){
		?>
				$group = <?php echo $_GET["group_id"] ?>;
				$.get("guzzler.php", { 'group_id' : $group }, function(data_files) {
					urls = JSON.parse(data_files);
					for (i = 0; i < data_files.length; ++i)
						console.log(urls[i])
				});
		<?php
			}
		?>

		</script>

		<script type="text/javascript">
			//url: "http://cgi.sfu.ca/~oalemi/movan/srv/upload.php",
			$(function() {
				$('#fileupload').fileupload({
					dataType : 'csv',
					done : function(e, data) {
						console.log(data);
						$.each(data.result.files, function(index, file) {
							$('<p/>').text(file.name).appendTo(document.body);
						});
					}
				});
			});
		</script>
		
		<script type="text/javascript">
		
		/**
		 * Source : http://stackoverflow.com/questions/814613/how-to-read-get-data-from-a-url-using-javascript
		 */
		function parseURLParams(url) {
	        var queryStart = url.indexOf("?") + 1,
	            queryEnd   = url.indexOf("#") + 1 || url.length + 1,
	            query = url.slice(queryStart, queryEnd - 1),
	            pairs = query.replace(/\+/g, " ").split("&"),
	            parms = {}, i, n, v, nv;
	    
	        if (query === url || query === "") {
	            return;
	        }
	    
	        for (i = 0; i < pairs.length; i++) {
	            nv = pairs[i].split("=");
	            n = decodeURIComponent(nv[0]);
	            v = decodeURIComponent(nv[1]);
	    
	            if (!parms.hasOwnProperty(n)) {
	                parms[n] = [];
	            }
	    
	            parms[n].push(nv.length === 2 ? v : null);
	        }
	        return parms;
    	}
	    
	    function apiCall(url, cbk){
	      $.ajax({
	         type: "GET",
	         url: url,
	         success: cbk
	      });
	    }
			
		var params = parseURLParams(document.URL);
		
		var take_id = params["take_id"][0];
		var url = "/takes/"+take_id+".json";
		
		apiCall(url, function(data){
		  var data_tracks = data.data_tracks;
		  var bvhFiles = [];
		  var c3dFiles = [];
		  var movFiles = [];
		  var mp4Files = [];
		  data_tracks.forEach(function(d){
		  	console.log(d)
		    if(d.data_track_url.indexOf("bvh.json") > -1){
		      bvhFiles.push(d.data_track_url);
		    }else if(d.data_track_url.indexOf("c3d.json") > -1){
		    	c3dFiles.push(d.data_track_url);
		    }else if(d.data_track_url.indexOf("mp4.json") > -1){
		    	mp4Files.push(d.data_track_url)
		    }else if(d.data_track_url.indexOf("mov.json") > -1){
		    	movFiles.push(d.data_track_url)
		    }

		  })
		  
		  if(bvhFiles.length > 0){
		    //for now do it just for the first one
		    apiCall(bvhFiles[0], function(data){
		      var asset_url = data.asset_url;
		      bvhData = new BVHReader().load(asset_url, showBVH)
		    })
		  }

		  if(movFiles.length > 0){
		    //for now do it just for the first one
		    apiCall(movFiles[0], function(data){
		      var asset_url = data.asset_url;
		      console.log("Setting mov video: " + asset_url)
		      video = $("#mov-video")[0];
		      video.innerHTML = '<source type="video/mov" src="'+asset_url+'">';
		    })
		  }


		  if(mp4Files.length > 0){
		    //for now do it just for the first one
		    apiCall(mp4Files[0], function(data){
		      var asset_url = data.asset_url;
		      console.log("Setting mp4 video: " + asset_url)
		      video = $("#mp4-video")[0];
		      video.innerHTML = '<source type="video/mp4" src="'+asset_url+'">';
		    })
		  }


		})
		function showBVH(data){
		  g_bvh = data;
		  //add code to visualize g_bvh
		}
		</script>
		<div id="footer" style="clear:both;text-align:center;padding-top:20px;">
			<small>(C) Omid Alemi - Fall 2013</small>
		</div>
	</body>
</html>
