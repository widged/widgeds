<?php
  header("Access-Control-Allow-Origin: http://widgeds.wikispaces.com/");
  header("Cache-Control: no-cache");
  header("Expires: -1");
	header ("Content-Type:text/xml");
	$url= "http://www.digitalnz.org/timeline/search?search_text=" . $_REQUEST['search_text'] . "&start=" . $_REQUEST['start'];
	if ($fp = fopen($url, 'r')) {
	   $content = '';
	   // keep reading until there's nothing left 
	   while ($line = fread($fp, 1024)) {
	      $content .= $line;
	   }
 	   echo $content;
	} else {
	   // an error occured when trying to open the specified url 
	}
?>