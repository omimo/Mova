<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Mova: Movement Analytics Platform</title>

	<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
	<link href="http://vjs.zencdn.net/4.12/video-js.css" rel="stylesheet">
	<link href="jq/css/smoothness/jquery-ui-1.10.3.custom.css" rel="stylesheet"/>
	<link rel="stylesheet" type="text/css" href="jq/css/jquery-ui-slider-pips.css">
	<link rel="stylesheet" type="text/css" href="styles/jqx.base.css">
	<link href="css/style.css" rel="stylesheet"/>

	<script src="jq/jquery-2.0.3.min.js"></script>

	<script>

	</script>


	<style>
	.track{
		opacity: .5;
	}

	.segment{
		cursor: move;
		opacity: .3
	}

	.resize-left{
		cursor: w-resize;
	}

	.resize-right{
		cursor: e-resize;	
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

	.axis path,
	.axis line {
		fill: none;
		stroke: black;
		shape-rendering: crispEdges;
	}

	.axis path {
		stroke-width: 3px;
	}

	.axis text {
		font-family: sans-serif;
		font-size: 11px;
	}
	</style>
</head>
<body>

	<script type="text/javascript">
   	$.ajax({
		url: "http://moda.movingstories.ca/movement_annotations/",
		contentType: "multipart/form-data",
		dataType: "json",
		type: "POST",
		data: {
			"movement_annotation": {
				"asset_file" : {
					"original_filename":"foo1.json",
					"file":"e3ZhbHVlOidmb28nfQ==",
					"content_type":"application/json"
				},
				"attached_id":"368",
				"attached_type":"Take",
				"description":"barbarbar",
				"name":"foofoofoo"
			}	
		}
	});

	</script>


</body>
</html>
