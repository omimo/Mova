<?php 

	// echo "group ". $_GET["group_id"];

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	try {
		$loader = require 'vendor/autoload.php';
	}
	catch (Exception $e) {
	    echo 'Caught exception: ',  $e->getMessage(), "\n";
	    phpinfo();
	}

	use GuzzleHttp\Client;
	$client = new Client();

	// put try-catch? 
	$res = $client->get('http://209.87.60.87/movement_groups/' . $_GET["group_id"] . '.json', 
		['auth' =>  ['alejandro@zandtwerk.org', 'MovaMova1#']]);

	$tracks = json_decode($res->getBody())->{'data_tracks'};

	// print_r($tracks);

	// echo tracks;

	$asset_urls = array();

	foreach ($tracks as $track) {
		$url = $track->{"url"};
		
		try {
			$res_t = $client->get($track->{"url"}, 
				['auth' =>  ['alejandro@zandtwerk.org', 'MovaMova1#']]);

			array_push($asset_urls, json_decode($res_t->getBody())->{"asset_url"});	
		}
		catch (Exception $e) {
	    	// echo 'Caught exception: ',  $e->getMessage(), "\n";
		}
	}
	// print_r($track_urls);

	echo json_encode($asset_urls);

	echo "TEST";

	return json_encode($asset_urls);

?>