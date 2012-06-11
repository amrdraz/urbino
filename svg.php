<?php
header('Content-disposition: attachment; filename=out.svg');
header('Content-type: application/svg+xml');
readfile('out.svg');
?>