<?php


/**
 * @package Chums
 * @subpackage ProjectedDemands
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2013, steve
 */

require_once ("autoload.inc.php");
require_once ('access.inc.php');

$bodyPath = "apps/b2b-products";
$title = "B2B Products Editor";
$description = "";

$ui = new WebUI($bodyPath, $title, $description, true, 5);
$ui->bodyClassName = 'container-fluid';
$ui->AddCSS("public/css/styles.css");
$ui->AddCSS("https://b2b.chums.com/b2b-swatches/swatches.css");
$ui->addManifest('public/js/manifest.json');

$ui->Send();
