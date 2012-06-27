<?php
$my_file = 'out.html';
$handle = fopen($my_file, 'w') or die('Cannot open file:  '.$my_file);
$data = '<!DOCTYPE HTML>
<html>
	<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
	<title>Urbino</title>
  
	<script type="text/javascript" src="http://github.com/DmitryBaranovskiy/raphael/raw/master/raphael-min.js"></script>
  	<script type="text/javascript">
  		window.onload = (function(){
		var holder = document.getElementById("holder");
		holder.innerHTML = "";	//replace svg content with raphael
			'.$_POST['js'].'
  		});
	</script>
	<body>
	<div id="holder">
		'.$_POST['svg'].'
	</div>
	</body>
</html>
  ';
fwrite($handle, $data);
fclose($handle);
?>