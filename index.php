<?php

use chums\ui\WebUI2;
use chums\user\Groups;

require_once("autoload.inc.php");
$ui = new WebUI2([
    'requiredRoles' => Groups::WEB_ADMIN,
    'title' => 'B2B Products Editor',
    'bodyClassName' => 'container-fluid',
    'contentFile' => 'body.inc.php'
]);
$ui->addCSS('https://b2b.chums.com/b2b-swatches/swatches.css')
    ->addManifestJSON('public/js/manifest.json')
    ->render();
