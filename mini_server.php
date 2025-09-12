<?php
header("Content-Type: application/json; charset=UTF-8");

if (!isset($_GET['url']) || empty($_GET['url'])) {
    echo json_encode(["error" => "No se proporcionó una URL."]);
    exit;
}

$url = $_GET['url'];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_NOBODY, true);   // Solo HEAD
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode(["error" => "cURL error: " . curl_error($ch)]);
    curl_close($ch);
    exit;
}

$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$header_text = substr($response, 0, $header_size);
curl_close($ch);

// Procesar encabezados en array
$headers = [];
foreach (explode("\r\n", $header_text) as $line) {
    if (strpos($line, ":") !== false) {
        list($key, $value) = explode(":", $line, 2);
        $headers[strtolower(trim($key))] = trim($value);
    }
}

// Si no se encontraron encabezados
if (empty($headers)) {
    echo json_encode(["error" => "No se pudieron obtener encabezados"]);
    exit;
}

echo json_encode($headers, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
