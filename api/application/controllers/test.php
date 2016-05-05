<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *'); 
class Test extends CI_Controller {
	function __construct()
			{
				parent::__construct();
			}
public function index(){			
 $to = 'nimitw@gmail.com'; 
 $subject = 'Test email using PHP'; 
 $message = '<h1>This is a test email message</h1>'; 
 $headers = 'From: nimit.geetkech@cityoflaredocalendar.com' . "\r\n" . 'Reply-To: nimit.geetkech@cityoflaredocalendar.com' . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
 mail($to, $subject, $message, $headers, '-fnimit.geetkech@cityoflaredocalendar.com'); 
}

}

?>