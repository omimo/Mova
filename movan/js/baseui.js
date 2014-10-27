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

				
				
				
				//**** Event Handlers
				document.getElementById("fileSelect").addEventListener("change",movan.loadNew);
				
				
				
				//
				var chosenFileEntry = null;

				$("#btnfileopen").button();
				$("#btnfileopen").click( function(e) {
				  chrome.fileSystem.chooseEntry({type: 'openFile'}, function(readOnlyEntry) {

				    readOnlyEntry.file(function(file) {
				      var reader = new FileReader();
				      console.log("here is the content of" + file);
				 
				      reader.onloadend = function(e) {
				    	  
				        console.log(e.target.result);
				      };

				      reader.readAsText(file);
				    });
					});
				});
				
			});

