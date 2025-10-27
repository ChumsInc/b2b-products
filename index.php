<?php

use chums\ui\WebUI2;
use chums\user\Groups;

require_once("autoload.inc.php");
$ui = new WebUI2([
    'requiredRoles' => [Groups::WEB_ADMIN],
    'title' => 'B2B Products Editor',
    'bodyClassName' => 'container-fluid',
    'contentFile' => 'body.inc.php'
]);
$ui->addCSS('/css/b2b-swatches/swatches.css')
    ->addViteManifest()
    ->render();
