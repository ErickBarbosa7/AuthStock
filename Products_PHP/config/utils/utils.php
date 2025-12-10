<?php
namespace Config\utils;

use Ramsey\Uuid\Uuid as uuid;

class Utils {
    public static function uuid (){
        return uuid::uuid4();
    }

    public static function hash(string $password){
        // CORRECCIÓN: Quitamos el '$' porque password_hash es una función nativa
        return password_hash($password, PASSWORD_DEFAULT, ['cost' => 12]);
    }

    public static function verify(string $pass_plain, string $pass_hash){
        // CORRECCIÓN: Quitamos el '$' porque password_verify es una función nativa
        return password_verify($pass_plain, $pass_hash);
    }

    public static function get_ip() {
        $mainIP = '';

        if (getenv('HTTP_CLIENT_IP'))
            $mainIP = getenv('HTTP_CLIENT_IP');
        elseif (getenv('HTTP_X_FORWARDED_FOR'))
            $mainIP = getenv('HTTP_X_FORWARDED_FOR');
        elseif (getenv('HTTP_X_FORWARDED'))
            $mainIP = getenv('HTTP_X_FORWARDED');
        elseif (getenv('HTTP_FORWARDED_FOR'))
            $mainIP = getenv('HTTP_FORWARDED_FOR');
        elseif (getenv('HTTP_FORWARDED'))
            $mainIP = getenv('HTTP_FORWARDED');
        elseif (getenv('REMOTE_ADDR'))
            $mainIP = getenv('REMOTE_ADDR');
        else
            $mainIP = 'UNKNOWN';

        return $mainIP;
    }
}