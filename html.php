<?php
header('Content-disposition: attachment; filename=out.html');
header('Content-type: text/html');
readfile('out.html');
?>