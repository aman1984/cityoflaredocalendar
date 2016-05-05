<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *'); 
class Register extends CI_Controller {
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

	function registerUser(){
		if(isset($_POST)){
      	$checkUser = $this->web_services_model->checkUser($_POST['email']);
      	if($checkUser==true){
            $data['name'] = ucfirst($_POST['name']);
            $data['middle_name'] = $_POST['middle_name']!=='undefined' ? ucfirst($_POST['middle_name']) : '';
      	$data['last_name'] = $_POST['last_name']!=='undefined' ? ucfirst($_POST['last_name']) : '';
            $data['email'] = $_POST['email'];
            $data['title'] = $_POST['title']!=='undefined' ? $_POST['title'] : '';
            $data['organization'] = $_POST['organization']!=='undefined' ? $_POST['organization'] : '';
      	$data['phone'] = $_POST['phone']!=='undefined' ? $_POST['phone'] : '';
      	$data['password'] = md5($_POST['password']);
      	$data['reg_time'] = time();
      	$register = $this->web_services_model->registerUser($data);
      	if($register!==false){
                  $to = $_POST['email'];
                  $subject = "Registration";
                  $message = "<h3>Account created<h3><p>Hello ".$_POST['name'].", Thank you for registering with ".$this->web_services_model->site_name.". Your account in under review. We will notify you once it has been activated.</p>";
                  $headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
                  mail($to,$subject,$message,$headers, '-f'.$this->web_services_model->mail_from);

      		$data1['success'] = true;
      		$data1['message'] = "Registered successfully";
                  $data1['user_id'] = $register;
      	}else{
      		$data1['success'] = false;
      		$data1['message'] = "Something went wrong";
      	}
      	}else{
      		$data1['success'] = false;
      		$data1['message'] = "Email id already exist";
     		
      	}
		}else{
			$data1['success'] = false;
			$data1['message'] = 'Details not provided';
		}
		echo json_encode($data1);
	}

	function createUser(){
		if(isset($_POST)){
      	$checkUser = $this->web_services_model->checkUser($_POST['email']);
      	if($checkUser==true){
      	$data['name'] = ucfirst($_POST['name']);
            $data['middle_name'] = $_POST['middle_name']!=='undefined' ? ucfirst($_POST['middle_name']) : '';
            $data['last_name'] = $_POST['last_name']!=='undefined' ? ucfirst($_POST['last_name']) : '';
            $data['email'] = $_POST['email'];
            $data['title'] = $_POST['title']!=='undefined' ? $_POST['title'] : '';
            $data['organization'] = $_POST['organization']!=='undefined' ? $_POST['organization'] : '';
            $data['phone'] = $_POST['phone']!=='undefined' ? $_POST['phone'] : '';
            $data['password'] = md5($_POST['password']);
            $data['reg_time'] = time();
      	$register = $this->web_services_model->createUser($data);
      	if($register!==false){
      		$to = $_POST['email'];
		      $subject = "Account created";
		      $message = "<h3>Account created<h3><p>Hello ".$_POST['name'].", your account has been created. Your credentials are listed below</p><br><br><b>Email ID: ".$_POST['email']."</b><br><b>Password:". $_POST['password']."</b>";
                  $headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
                  $mail = mail($to,$subject,$message,$headers, '-f'.$this->web_services_model->mail_from);
      		$data1['success'] = true;
      		$data1['message'] = "Registered successfully";
      	}else{
      		$data1['success'] = false;
      		$data1['message'] = "Something went wrong";
      	}
      	}else{
      		$data1['success'] = false;
      		$data1['message'] = "Email id already exist";
     		
      	}
		}else{
			$data1['success'] = false;
			$data1['message'] = 'Details not provided';
		}
		echo json_encode($data1);
	}

	function registerAdmin(){
		if(isset($_POST)){
      	$checkAdmin = $this->web_services_model->checkAdmin($_POST['email']);
      	if($checkAdmin==true){
      	$data['fullname'] = $_POST['fullname'];
      	$data['email'] = $_POST['email'];
      	$data['password'] = md5($_POST['password']);
            $data['type'] = 'sub';
      	$data['account_status'] = 'active';
      	$data['reg_time'] = time();
      	$register = $this->web_services_model->registerAdmin($data);
      	if($register!==false){
      		$to = $_POST['email'];
		      $subject = "Account created";
		      $message = "<h3>Account created<h3><p>Hello ".$_POST['fullname'].", your account has been created. You have admin privellages.</p><br> Your credentials are listed below</p><br><br><b>Email ID: ".$_POST['email']."</b><br><b>Password:". $_POST['password']."</b>";
		      $headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
		      $mail = mail($to,$subject,$message,$headers);
      		$data1['success'] = true;
      		$data1['message'] = "Registered successfully";
      	}else{
      		$data1['success'] = false;
      		$data1['message'] = "Something went wrong";
      	}
      	}else{
      		$data1['success'] = false;
      		$data1['message'] = "Email id already exist";
     		
      	}
		}else{
			$data1['success'] = false;
			$data1['message'] = 'Details not provided';
		}
		echo json_encode($data1);
	}

}