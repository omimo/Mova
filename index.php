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

				// $("#tabs").click(function(event, ui){
				// console.log(event);
				// if (event.options.selected == 0)
				// playAnim = false;
				// else if (event.options.selected == 1)
				// {playAnim = true;console.log("heee");}
				// }
				// );

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

			});
		</script>

		<style>
		</style>
	</head>
	<body>

		<div id="header" style="clear:both;">
			<h1 style="float: left;">Mova: Movement Analytics Platform</h1>
			<h4 style="float: right;">Version 0.7  |   <a href="Mova_Intro.mov" target="_blank">Video Intro</a></h4>
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
				

				</ul>
				<div id="anim">
					<button id="btnPlay">
						&nbsp;Play&nbsp;&nbsp;
					</button>
				</div>
				<div id="figure">

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
					 <option value="movs/MS2_8Walk_M_nopos.bvh" selected="selected">MS2_8Walk_M_nopos.bvh</option> 
						<option value="movs/Slash_x4_0001KAREN.bvh">Slash_x4_0001KAREN.bvh</option>
						<option value="movs/MS2_8Walk_M.bvh">MS2_8Walk_M.bvh</option>
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
			movan.loadFeatures();
			movan.loadNew();
		
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
		<div id="footer" style="clear:both;text-align:center;padding-top:20px;">
			<small>(C) Omid Alemi - Fall 2013</small>
		</div>
 </body>
</html>