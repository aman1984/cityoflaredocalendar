<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *'); 
class Test2 extends CI_Controller {
	function __construct()
			{
				parent::__construct();
			}
public function index(){			


	 $this->load->library('email');

            $subject = 'This is a test';
            $message = '<p>This message has been sent for testing purposes.</p>';

            // Get full html:
            $body =
'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset='.strtolower(config_item('charset')).'" />
    <title>'.html_escape($subject).'</title>
    <style type="text/css">
        body {
            font-family: Arial, Verdana, Helvetica, sans-serif;
            font-size: 16px;
        }
    </style>
</head>
<body>
'.$message.'
</body>
</html>';
            // Also, for getting full html you may use the following internal method:
            //$body = $this->email->full_html($subject, $message);

            $result = $this->email
                ->from('nimit.geektech@gmail.com')
                ->reply_to('nimit.geektech@gmail.com')    // Optional, an account where a human being reads.
                ->to('nimitw@gmail.com')
                ->subject($subject)
                ->message($body)
                ->send();

            var_dump($result);
            echo '<br />';
            echo $this->email->print_debugger();

            exit;


}

}

?>