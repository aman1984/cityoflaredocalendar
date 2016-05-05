<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *'); 
class ForgotPassword extends CI_Controller {
	function __construct()
			{
				parent::__construct();
				$this->load->model("web_services_model");
			}
	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -  
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in 
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
		//$this->load->view('welcome_message');
	}


	function sendMail()
		{
			if(!empty($_POST['email'])){
			$requestPassword = $this->web_services_model->requestPassword($_POST['email']);
			if($requestPassword!==false){
			//$url = 'http://localhost:3000/pages/auth/reset-password?id='.$requestPassword;
			$time = time() + (3600*3);
			$encode_time = base64_encode($time);
			$site_url = $this->web_services_model->site_url;
			$url = $site_url.'auth/reset-password?id='.$requestPassword.'&v='.$encode_time;
		   	$email = $this->input->post('email');
	        $to = $email;
			$subject = "Password recovery";
			$message = "<h3>Password recovery mail<h3><p>Click below link to recover password.</p><br><p>".$url."</p>";
        	$headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
			$mail = mail($to,$subject,$message,$headers, '-f'.$this->web_services_model->mail_from);
			if($mail){
				$data['success'] = true;
		    	$data['message'] = "Link sent";
			}else{
				$data['success'] = false;
		    	$data['message'] = "Not able to send mail";
			}
		}else{
			$data['success'] = false;
		    $data['message'] = "Something went wrong";
		}
		}else{
		    $data['success'] = false;
		    $data['message'] = "Fields required";
		}
		echo json_encode($data);
			
	}

	function adminRequestPassword()
		{
			if(!empty($_POST['email'])){
			$adminRequestPassword = $this->web_services_model->adminRequestPassword($_POST['email']);
			if($adminRequestPassword!==false){
			//$url = 'http://localhost:3000/auth/reset-password-admin?id='.$adminRequestPassword;
			$time = time() + (3600*3);
			$encode_time = base64_encode($time);
			$site_url = $this->web_services_model->site_url;
			$url = $site_url.'auth/reset-password-admin?id='.$adminRequestPassword.'&v='.$encode_time;
		   	$email = $this->input->post('email_id');
	        $to = $email;
			$subject = "Password recovery";
			$message = "<h3>Password recovery mail<h3><p>Click below link to recover password.</p><br><p>".$url."</p>";
        	$headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
			$mail = mail($to,$subject,$message,$headers, '-f'.$this->web_services_model->mail_from);
			if($mail){
				$data['success'] = true;
		    	$data['message'] = "Link sent";
			}else{
				$data['success'] = false;
		    	$data['message'] = "Not able to send mail";
			}
		}else{
			$data['success'] = false;
		    $data['message'] = "Something went wrong";
		}
		}else{
		    $data['success'] = false;
		    $data['message'] = "Fields required";
		}
		echo json_encode($data);
			
	}

	function masterRequestPassword()
		{
			if(!empty($_POST['email'])){
			$adminRequestPassword = $this->web_services_model->adminRequestPassword($_POST['email']);
			if($adminRequestPassword!==false){
			//$url = 'http://localhost:3000/auth/reset-password-admin?id='.$adminRequestPassword;
			$time = time() + (3600*3);
			$encode_time = base64_encode($time);
			$site_url = $this->web_services_model->site_url;
			$url = $site_url.'auth/reset-password-master?id='.$adminRequestPassword.'&v='.$encode_time;
		   	$email = $this->input->post('email_id');
	        $to = $email;
			$subject = "Password recovery";
			$message = "<h3>Password recovery mail<h3><p>Click below link to recover password.</p><br><p>".$url."</p>";
        	$headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
			$mail = mail($to,$subject,$message,$headers, '-f'.$this->web_services_model->mail_from);
			if($mail){
				$data['success'] = true;
		    	$data['message'] = "Link sent";
			}else{
				$data['success'] = false;
		    	$data['message'] = "Not able to send mail";
			}
		}else{
			$data['success'] = false;
		    $data['message'] = "Something went wrong";
		}
		}else{
		    $data['success'] = false;
		    $data['message'] = "Fields required";
		}
		echo json_encode($data);
			
	}

}