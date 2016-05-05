<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class VerifyLogin extends CI_Controller {

 function __construct()
 {
   parent::__construct();
   $this->load->model('LoginModel','',TRUE);

 }

 function index()
 {
   //This method will have the credentials validation
   $this->load->library('form_validation');
   $this->load->helper('form');
   $this->form_validation->set_rules('email', 'Email', 'trim|required|xss_clean|valid_email');
   $this->form_validation->set_rules('password', 'Password', 'trim|required|xss_clean|callback_check_database');
   $this->form_validation->set_error_delimiters('<div style="color:red">', '</div>');
   if($this->form_validation->run() == FALSE)
   {
    $data[] = $_POST;
     //Field validation failed.  User redirected to login page
     $this->load->view('login', $data);
   }
   else
   {
     //Go to private area
     redirect('home');
   }

 }


 function check_database($password)
 {
   //Field validation succeeded.  Validate against database
   $email = $this->input->post('email');

   //query the database
   $result = $this->LoginModel->login($email, $password);

   if($result)
   {
     $sess_array = array();
     foreach($result as $row)
     {
       $sess_array = array(
         'user_id' => $row->user_id,
         'email' => $row->email,
         'firstname' => $row->firstname,
         'lastname' => $row->lastname,
         'time' => $row->time
         );

       $this->session->set_userdata('logged_in', $sess_array);
     }
     return TRUE;
   }
   else
   {
     $this->form_validation->set_message('check_database', 'Invalid username or password');
     return false;
   }
 }
}
?>