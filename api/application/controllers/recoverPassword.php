<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *'); 
class RecoverPassword extends CI_Controller {
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
		if(!isset($_GET['e'])){
			redirect('login');
		}else{
			$email['email'] = $_GET['e'];
			//$recoverPass = $this->web_services_model->recoverPassword($_GET['e']);
			$this->load->view('recover_password', $email);
		}
		
	}

	

	function resetPassword(){
		if(!empty($_POST['password'])){
		$time = $_POST['time'];
		$time = base64_decode($time);
		if($time<time()){
			$data['success'] = false;
			$data['message'] = 'Your password reset time has expired. Please put a new request.';
			echo json_encode($data);
			return;
		}
		$updateUserPassword = $this->web_services_model->updateUserPassword(md5($_POST['password']), $_POST['token']);
		if($updateUserPassword==true){
      	$data['success'] = true;
	    $data['message'] = "Password changed";
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

	function resetAdminPassword(){
		if(!empty($_POST['password'])){
		$time = $_POST['time'];
		$time = base64_decode($time);
		if($time<time()){
			$data['success'] = false;
			$data['message'] = 'Your password reset time has expired. Please put a new request.';
			echo json_encode($data);
			return;
		}
		$resetAdminPassword = $this->web_services_model->resetAdminPassword(md5($_POST['password']), $_POST['token']);
		if($resetAdminPassword==true){
      	$data['success'] = true;
	    $data['message'] = "Password changed";
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

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */