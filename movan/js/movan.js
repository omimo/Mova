var movan = {

	 		 gframes : [],
			 gskel : [],
			 grootOffset : [],
			 gpadding : 10,
			
			 inputFPS : 0.0083, //120	
			
			 defSelectedJoint : 0, //19,
			 skelHeadJoint : 23,
			 frameSkip : 5,

			figureScale: 1, //TODO: Need to add a scale control in the GUI (or automatic detection)
			
			
			availableFeatures : [
							[f_angvel,calcVelocities,1],
							[f_accel,calcAccel,1],
							[f_jerk,calcJerk,1],
							[f_overhips,calcJoHips,1],
							[f_directseg,calcSpace_Pathway_Omid,1],
							[f_space,calcSpace_K,1],
							[f_weight,calcWeight_K,1],
							[f_time,calcTime_K,1],
							[f_flow,calcFlow_K,1],
							[f_BEA_Ann,readAnn2,1]
							],
							
			selectedFeats : [],
				
			loadFeatures: function () {
				
				d3.select("#featDropdown")
				.selectAll("option")
				.data(movan.availableFeatures)
				.enter()
				.append("option")
				.attr("id", function(d,i) {
					return "chkFeat"+i;
				})
				.attr("value",function(d,i) {
					return i;
				})
				.text(function(d,i){
					return d[0].label;
				});
				//.on("change",function(d){movan.reDoFeats();});
				
			},
			
			
			fillDefaultFeatures: function () {
				movan.selectedFeats = [];
				var len = movan.selectedFeats.length; 
				
				
				var sel =9;
				var joint = 11; 
			    movan.selectedFeats[len] =[];
			    movan.selectedFeats[len].id = len;
			    movan.selectedFeats[len].featID = sel;
				movan.selectedFeats[len].f = movan.availableFeatures[sel][0];
				movan.selectedFeats[len].data = movan.availableFeatures[sel][1](movan.gframes, movan.frameSkip,joint,0);
				movan.selectedFeats[len].joint = joint;
				
				len++;
				
				/*
				var joint = 18; 
			    movan.selectedFeats[len] =[];
			    movan.selectedFeats[len].id = len;
			    movan.selectedFeats[len].featID = sel;
				movan.selectedFeats[len].f = movan.availableFeatures[sel][0];
				movan.selectedFeats[len].data = movan.availableFeatures[sel][1](movan.gframes, movan.frameSkip,joint,0);
				movan.selectedFeats[len].joint = joint;
				
				len++;
				
				var joint = 19; 
			    movan.selectedFeats[len] =[];
			    movan.selectedFeats[len].id = len;
			    movan.selectedFeats[len].featID = sel;
				movan.selectedFeats[len].f = movan.availableFeatures[sel][0];
				movan.selectedFeats[len].data = movan.availableFeatures[sel][1](movan.gframes, movan.frameSkip,joint,0);
				movan.selectedFeats[len].joint = joint;
				
				len++;
				
				var sel = 1;
				var joint = 19; 
			    movan.selectedFeats[len] =[];
			    movan.selectedFeats[len].id = len;
			    movan.selectedFeats[len].featID = sel;
				movan.selectedFeats[len].f = movan.availableFeatures[sel][0];
				movan.selectedFeats[len].data = movan.availableFeatures[sel][1](movan.gframes, movan.frameSkip,joint,0);
				movan.selectedFeats[len].joint = joint;
				
				len++;
				
				var sel = 2;
				var joint = 19; 
			    movan.selectedFeats[len] =[];
			    movan.selectedFeats[len].id = len;
			    movan.selectedFeats[len].featID = sel;
				movan.selectedFeats[len].f = movan.availableFeatures[sel][0];
				movan.selectedFeats[len].data = movan.availableFeatures[sel][1](movan.gframes, movan.frameSkip,joint,0);
				movan.selectedFeats[len].joint = joint;
				
				len++;
				
				var sel = 4;  //direct segments
				var joint = 19; 
			    movan.selectedFeats[len] =[];
			    movan.selectedFeats[len].id = len;
			    movan.selectedFeats[len].featID = sel;
				movan.selectedFeats[len].f = movan.availableFeatures[sel][0];
				movan.selectedFeats[len].data = movan.availableFeatures[sel][1](movan.gframes, movan.frameSkip,joint,0);
				movan.selectedFeats[len].joint = joint;
				
				len++;
				
				var sel = 5; //space
				var joint = 19; 
			    movan.selectedFeats[len] =[];
			    movan.selectedFeats[len].id = len;
			    movan.selectedFeats[len].featID = sel;
				movan.selectedFeats[len].f = movan.availableFeatures[sel][0];
				movan.selectedFeats[len].data = movan.availableFeatures[sel][1](movan.gframes, movan.frameSkip,joint,0);
				movan.selectedFeats[len].joint = joint;
				
				len++;
				
				var sel = 6; //weight
				var joint = 19; 
			    movan.selectedFeats[len] =[];
			    movan.selectedFeats[len].id = len;
			    movan.selectedFeats[len].featID = sel;
				movan.selectedFeats[len].f = movan.availableFeatures[sel][0];
				movan.selectedFeats[len].data = movan.availableFeatures[sel][1](movan.gframes, movan.frameSkip,joint,0);
				movan.selectedFeats[len].joint = joint;
				
				len++;
				
				var sel = 7;  //time
				var joint = 19; 
			    movan.selectedFeats[len] =[];
			    movan.selectedFeats[len].id = len;
			    movan.selectedFeats[len].featID = sel;
				movan.selectedFeats[len].f = movan.availableFeatures[sel][0];
				movan.selectedFeats[len].data = movan.availableFeatures[sel][1](movan.gframes, movan.frameSkip,joint,0);
				movan.selectedFeats[len].joint = joint;
				
				len++;
				
				var sel = 8;  //flow
				var joint = 19; 
			    movan.selectedFeats[len] =[];
			    movan.selectedFeats[len].id = len;
			    movan.selectedFeats[len].featID = sel;
				movan.selectedFeats[len].f = movan.availableFeatures[sel][0];
				movan.selectedFeats[len].data = movan.availableFeatures[sel][1](movan.gframes, movan.frameSkip,joint,0);
				movan.selectedFeats[len].joint = joint;
				
				len++;
				
				var sel = 9;  //BEA Ann
				var filename = 'testann1.csv'; 
			    movan.selectedFeats[len] =[];
			    movan.selectedFeats[len].id = len;
			    movan.selectedFeats[len].featID = sel;
				movan.selectedFeats[len].f = movan.availableFeatures[sel][0];
				movan.selectedFeats[len].data = movan.availableFeatures[sel][1](movan.gframes, movan.frameSkip,joint,filename);
				movan.selectedFeats[len].joint = joint;*/
				
				movan.reDrawFeat();
			},
			
			loadNew: function () {
							

				var moveFile = "movs/"+document.getElementById("fileSelect").value;
				var skelFile = "movs/ecuad1.skel2";
				
				//FIXME: This is just a dummy way to do it!
				//TODO: Put the skel data in the mocap csv file
				
				
				if (moveFile.search("KAREN") != -1) {
					movan.figureScale = 2;
					movan.skelHeadJoint = 7;
					skelFile = "movs/MSDec9.skel";
				}
				else 
				{
					movan.figureScale = 0.5;
					movan.skelHeadJoint = 23;
				}
					
				
				loadData(moveFile, skelFile, movan.callbackForData);
			},
			
			callbackForData: function(frames, skel) {
				
				movan.gframes = frames;
				movan.gskel = skel;
				//makeFeats();
				
							
				d3.select("#jointDropdown").attr("selectedJoint", movan.defSelectedJoint);
				movan.drawJointChooser();
				
				movan.reDraw();
				
				movan.fillDefaultFeatures();
			},

			drawJointChooser: function () {
				//Draw the joint chooser
				firstFrame = movan.gframes[0].map(function(d) {
					return {
						x : d.x * movan.figureScale + 140,
						y : -1 * d.y * movan.figureScale + 90 + 75,
						z : d.z * movan.figureScale
					};
				});
				
				d3.select("#jointLabel").text(movan.gskel.jointNames[d3.select("#jointDropdown").attr("selectedJoint")]);
				
					
				//Create SVG element
				d3.select("#jointChooser").selectAll("svg").remove();
				var jointChooser = d3.select("#jointChooser").append("svg").attr("height",170);
				figureSketch.drawJointChooser(jointChooser,firstFrame,0, d3.select("#jointDropdown").attr("selectedJoint")
						,movan.gskel,movan.drawJointChooser);
				
				d3.select("#jointLabel").text(movan.gskel.jointNames[d3.select("#jointDropdown").attr("selectedJoint")]);
				
				///
			},
			
			removeFeature: function(fid) {
				var newSF = [];
				var newCount = 0;
				
				
				for (var f in movan.selectedFeats){
					
				 if (movan.selectedFeats[f].id != fid) {
					 newSF[newCount] = movan.selectedFeats[f];
					 newSF[newCount].id = newCount;
					 newCount++;
				 }
				}
							
				
				movan.selectedFeats = newSF;
				movan.calcFeats();
				movan.reDoFeats();
			},
			
			reDraw: function () {
				movan.frameSkip = $("#sldSkip2").slider( "option", "value" );
				movan.padding = $("#sldPad2").slider( "option", "value" );
				
				d3.select("#figure").selectAll("svg").remove();
				d3.select("#anim").selectAll("svg").remove();
				d3.select("#trajec").selectAll("svg").remove();
				
				// Draw the figure sketch
				movan.rootOffset = figureSketch.drawFiguresCanvas(d3.select("body").select("#figure"), 
									movan.gframes, movan.gskel, -1, movan.frameSkip, movan.padding);
				
				// Prep the animation
				anim.animSVG = anim.makeAnim(d3.select("body").select("#anim"), 
									movan.gframes, movan.gskel, -1, movan.frameSkip, movan.padding);
				
				//playAnim = true;
				
				//trajectory.drawTrajectory(d3.select("#trajec"),movan.gframes,19,0,1);
				//figureSketch.drawSkelInfo(d3.select("#trajec"),movan.gframes[0],movan.gskel);
				
				//movan.makeFeats();
				movan.calcFeats();
				movan.reDrawFeat();
			},
			
			
			
			reDoFeats: function () {
				
				//movan.makeFeats();
				movan.reDrawFeat();
			},
			
			calcFeats: function () {
			 for (ii=0;ii<movan.selectedFeats.length;ii++) {
				 console.log(ii);
				movan.selectedFeats[ii].data = movan.availableFeatures[movan.selectedFeats[ii].featID][1](movan.gframes, movan.frameSkip,movan.selectedFeats[ii].joint,'');
				
				}
			},
			
			reDrawFeat: function () {
				drawnLegends = [];
				d3.select("#featureList").selectAll("svg").remove();
				d3.select("#featureList").selectAll("span").remove();
				drawFeatureList(d3.select("#featureList"), movan.rootOffset, movan.selectedFeats, movan.padding);
			}
			
};