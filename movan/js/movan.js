var movan = {

	 		 gframes : [],
			 gskel : [],
			 grootOffset : [],
			 gpadding : 10,
			
			 inputFPS : 0.0083, //120	
			
			 selectedJoint : 19,
			 skelHeadJoint : 23,
			 frameSkip : 5,

			
			
			
			availableFeatures : [
							[f_angvel,'Velocity',calcVelocities,1],
							[f_accel,'Acceleration',calcAccel,1],
							[f_jerk,'Jerk',calcJerk,1],
							[f_overhips,'Joint over Hips',calcJoHips,1],
							[f_directseg,'Direct Moves',calcSpace_Pathway_Omid,1],
							[f_space,'Space (Pathways)',calcSpace_Pathway,1],
							[f_weight,'Weight (Pathways)',calcWeight_K,1],
							],
							
			selectedFeats : [],
				
			loadFeatures: function () {
				
				var sp = d3.select("#featCheckboxes").selectAll("span")
				.data(movan.availableFeatures)
				.enter()
				.append("span");
				
				sp.append("input")
				.attr("type","checkbox")
				.attr("id", function(d,i) {
					return "chkFeat"+i;
				})
				.each(function(d) {
					if (d[3] ==1)
						d3.select(this).attr("checked","checked");
				})
				.on("change",function(d){movan.reDoFeats();});
				
				sp.append("span").text(function(d,i){
					return d[0].label;
				});
				
				sp.append("br");
			},
			
			loadNew: function () {
							

				var moveFile = "movs/"+document.getElementById("fileSelect").value;
				var skelFile = "movs/ecuad1.skel2";

				loadData(moveFile, skelFile, movan.callbackForData);
			},
			
			callbackForData: function(frames, skel) {
				
				movan.gframes = frames;
				movan.gskel = skel;
				//makeFeats();
				movan.reDraw();
			},

			reDraw: function () {
				
				//frameSkip = +document.getElementById("sldSkips").value;
				//padding = +document.getElementById("sldPad").value;
				movan.frameSkip = $("#sldSkip2").slider( "option", "value" );
				movan.padding = $("#sldPad2").slider( "option", "value" );
				
				d3.select("body").select("#figure").selectAll("svg").remove();
				d3.select("body").select("#anim").selectAll("svg").remove();
				
				// Draw the figure sketch
				movan.rootOffset = figureSketch.drawFiguresCanvas(d3.select("body").select("#figure"), 
									movan.gframes, movan.gskel, movan.selectedJoint, movan.frameSkip, movan.padding);
				
				// Prep the animation
				anim.animSVG = anim.makeAnim(d3.select("body").select("#anim"), 
									movan.gframes, movan.gskel, movan.selectedJoint, movan.frameSkip, movan.padding);
				
				//playAnim = true;
				
				//Draw the joint chooser
				firstFrame = movan.gframes[0].map(function(d) {
					return {
						x : d.x / 2 + 140,
						y : -1 * d.y / 2 + 90 + 75,
						z : d.z / 2
					};
				});
					
					
				//Create SVG element
				d3.select("#jointChooser").selectAll("svg").remove();
				var jointChooser = d3.select("#jointChooser").append("svg").attr("height",170);
				figureSketch.drawJointChooser(jointChooser,firstFrame,0, movan.selectedJoint,movan.gskel,movan.reDraw);
				
				d3.select("#jointLabel").text(movan.gskel.jointNames[movan.selectedJoint]);
				
				///
		
				
				movan.makeFeats();
				movan.reDrawFeat();
			},
			
			makeFeats: function () {
				
				movan.selectedFeats = [];
				f=0;
				
				
				for (var feat in movan.availableFeatures) {
					if (document.getElementById("chkFeat"+feat).checked) {
						movan.selectedFeats[f]= movan.availableFeatures[feat][0];
						movan.selectedFeats[f++].data = movan.availableFeatures[feat][2](movan.gframes, movan.frameSkip,movan.selectedJoint,0);
					}
				}
			
			},
			
			reDoFeats: function () {
				
				movan.makeFeats();
				movan.reDrawFeat();
			},
			
			reDrawFeat: function () {
				d3.select("#featureList").selectAll("svg").remove();

				drawFeatureList(d3.select("#featureList"), movan.rootOffset, movan.selectedFeats, movan.padding);
			}
			
};