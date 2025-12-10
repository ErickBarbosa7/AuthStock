<?php
namespace Config\Jwt;

class Jwt {
    // 1. Ponemos la clave ORIGINAL (tal cual está en Node antes del Buffer)
    private static $secret = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9@";
    
    public static function Check($token) {
        if (empty($token)) return false;

        $token = str_replace('Bearer ', '', $token);
        $parts = explode('.', $token);
        if (count($parts) != 3) return false;

        $header = $parts[0];
        $payload = $parts[1];
        $signature_provided = $parts[2];

        // PHP debe hacer: base64_encode($secret)
        $secretBase64 = base64_encode(self::$secret); 

        // Calculamos la firma usando la clave en Base64
        $signature_calculated = hash_hmac('sha256', "$header.$payload", $secretBase64, true);
        $signature_calculated = self::base64UrlEncode($signature_calculated);

        return hash_equals($signature_provided, $signature_calculated);
    }

    public static function GetData($token) {
        $token = str_replace('Bearer ', '', $token);
        $parts = explode('.', $token);
        if (count($parts) != 3) return null;

        return json_decode(base64_decode($parts[1]));
    }

    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}