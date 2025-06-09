<?php
// Router file for built-in PHP server
// Serves static files if they exist, otherwise routes to api.php
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
if ($uri !== '/' && file_exists(__DIR__.$uri)) {
    return false; // Serve the requested resource as-is.
}

include __DIR__.'/api.php';
