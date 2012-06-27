<?php
header('Content-disposition: attachment; filename=out.svg');
header('Content-type: image/svg+xml');
readfile('out.svg');
?>