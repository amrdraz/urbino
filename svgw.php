<?php
$my_file = 'out.svg';
$handle = fopen($my_file, 'w') or die('Cannot open file:  '.$my_file);
$data = $_POST['svg'];
fwrite($handle, $data);
?>