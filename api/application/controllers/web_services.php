<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *'); 
class Web_services extends CI_Controller {

 function __construct()
 {
   parent::__construct();
   $this->load->model('web_services_model','',TRUE);
 }

 function index()
 {
  
 }

 function checkAccessToken(){
    $headers = $this->input->request_headers();
  if (isset($headers['Test'])){
    return "got header";
  }else{
    return "no header";
  }
 }

 function loginUser(){
  if(!empty($_POST)){
    $login = $this->web_services_model->loginUser($_POST['email'], $_POST['password']);
    if(is_array($login)){
      $this->load->library('encrypt');
      $encode = json_encode($login[0]);
      $encrypted_string = $this->encrypt->encode($encode);
      $data['success'] = true;
      $data['data'] = $login[0];
      $data['access_token'] = $encrypted_string;
    }else{
      $data['success'] = false;
      $data['message'] = $login;
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Fields required";
  }
  echo json_encode($data);
 }

 function loginSubAdmin(){
  if(!empty($_POST)){
    $login = $this->web_services_model->loginSubAdmin($_POST['email'], $_POST['password']);
    if(!empty($login)){
      $data['success'] = true;
      $data['data'] = $login[0];
    }else{
      $data['success'] = false;
      $data['message'] = "Incorrect email id or password";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Fields required";
  }
  echo json_encode($data);
 }

 function loginAdmin(){
  if(!empty($_POST)){
    $login = $this->web_services_model->loginAdmin($_POST['email'], $_POST['password']);
    if(!empty($login)){
      $data['success'] = true;
      $data['data'] = $login[0];
    }else{
      $data['success'] = false;
      $data['message'] = "Incorrect email id or password";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Fields required";
  }
  echo json_encode($data);
 }

 function addEvent(){
  if(!empty($_POST)){
    $addEvent = $this->web_services_model->addEvent($_POST);
    if($addEvent!=false){
      $data['success'] = true;
      $data['message'] = "Event added successfully";
      $data['event_id'] = $addEvent;
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

function addEventAdmin(){
  if(!empty($_POST)){
    $addEventAdmin = $this->web_services_model->addEventAdmin($_POST);
    if($addEventAdmin!=false){
      $data['success'] = true;
      $data['message'] = "Event added successfully";
      $data['event_id'] = $addEventAdmin;
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

function adminEditEvent(){
  if(!empty($_POST)){
    $adminEditEvent = $this->web_services_model->adminEditEvent($_POST);
    if($adminEditEvent!=false){
      $data['success'] = true;
      $data['message'] = "Event updated successfully";
      $data['event_id'] = $adminEditEvent;
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

function userEditPendingEvent(){
  if(!empty($_POST)){
    $userEditPendingEvent = $this->web_services_model->userEditPendingEvent($_POST);
    if($userEditPendingEvent!=false){
      $data['success'] = true;
      $data['message'] = "Event added successfully";
      $data['event_id'] = $userEditPendingEvent;
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

function userEditApprovedEvent(){
  if(!empty($_POST)){
    $userEditApprovedEvent = $this->web_services_model->userEditApprovedEvent($_POST);
    if($userEditApprovedEvent!=false){
      $data['success'] = true;
      $data['message'] = "Event added successfully";
      $data['event_id'] = $userEditApprovedEvent;
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

function showUserEvents(){
  if(!empty($_POST)){
    $showUserEvents = $this->web_services_model->showUserEvents($_POST);
    if($showUserEvents!==false){
      $data['success'] = true;
      $data['message'] = "";
      $data['data'] = $showUserEvents;
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
 }

function showEventAttachments(){
  if(!empty($_POST)){
    $showEventAttachments = $this->web_services_model->showEventAttachments($_POST['event_id']);
    if($showEventAttachments!==false){
      $data['success'] = true;
      $data['data'] = $showEventAttachments;
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function showAllEvents(){
  if(!empty($_POST)){
    $showAllEvents = $this->web_services_model->showAllEvents($_POST);
    if($showAllEvents!==false){
      $data['success'] = true;
      $data['message'] = "";
      $data['data'] = $showAllEvents;
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function showApprovedEvents(){
  if(!empty($_POST)){
    $showApprovedEvents = $this->web_services_model->showApprovedEvents($_POST);
    if(!empty($showApprovedEvents)){
      $data['success'] = true;
      $data['message'] = "";
      $data['data'] = $showApprovedEvents;
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function searchApprovedEvents(){
  if(!empty($_POST)){
    $searchApprovedEvents = $this->web_services_model->searchApprovedEvents($_POST);
    if($searchApprovedEvents!==false){
      $data['success'] = true;
      $data['message'] = "";
      $data['data'] = $searchApprovedEvents;
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function textSearchApprovedEvents(){
  if(!empty($_POST)){
    $textSearchApprovedEvents = $this->web_services_model->textSearchApprovedEvents($_POST);
    if($textSearchApprovedEvents!==false){
      $data['success'] = true;
      $data['message'] = "";
      $data['data'] = $textSearchApprovedEvents;
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}


function deleteEvent(){
  if(!empty($_POST)){
    $deleteEvent = $this->web_services_model->deleteEvent($_POST);
    if($deleteEvent==true){
      $data['success'] = true;
      $data['message'] = "Event deleted";
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function approveEvent(){
  if(!empty($_POST)){
    if($_POST['status']=='pending'){
    $approveEvent = $this->web_services_model->approveEvent($_POST);
  }else if($_POST['status']=='modified'){
    $approveEvent = $this->web_services_model->approveModifiedEvent($_POST);
  }
    if(!empty($approveEvent)){
      $to = $approveEvent[0]['email'];
      $subject = "Event approved";
      $modification_text = '';
      if($_POST['status']=='modified'){
        $modification_text = 'modification';
      }
      $message = "<h3>Event ".$modification_text." approval</h3><p>Hello ".$approveEvent[0]['name'].", your event titled ".$approveEvent[0]['title']." has been approved. It will be available to users on the calendar.</p>";
        $headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
      $mail = mail($to,$subject,$message,$headers, '-f'.$this->web_services_model->mail_from);
      if($mail){
      $data['success'] = true;
      $data['message'] = "Event approved";
      }else{
        $data['success'] = false;
        $data['message'] = "Not able to send email but event approved";
      }
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function declineEvent(){
  if(!empty($_POST)){
    if($_POST['status']=='pending'){
    $declineEvent = $this->web_services_model->declineEvent($_POST);
  }else if($_POST['status']=='modified'){
    $declineEvent = $this->web_services_model->declineEventModified($_POST);
  }
    if(!empty($declineEvent)){
      $modification_text = '';
      if($_POST['status']=='modified'){
        $modification_text = 'modification';
      }
      $to = $declineEvent[0]['email'];
      $subject = "Event declined";
      $message = "<h3>Event ".$modification_text." declined</h3><p>Hello ".$declineEvent[0]['name'].", your event titled ".$declineEvent[0]['title']." has been declined.</p>";
        $headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
      $mail = mail($to,$subject,$message,$headers, '-f'.$this->web_services_model->mail_from);
      if($mail){
      $data['success'] = true;
      $data['message'] = "Event declined";
      }else{
        $data['success'] = false;
        $data['message'] = "Not able to send email but event declined";
      }
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function showAllUsers(){
  if(!empty($_POST)){
    $showAllUsers = $this->web_services_model->showAllUsers($_POST);
    if(!empty($showAllUsers)){
      $data['success'] = true;
      $data['message'] = "";
      $data['data'] = $showAllUsers;
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function showAllAdmins(){
  if(!empty($_POST)){
    $showAllAdmins = $this->web_services_model->showAllAdmins($_POST);
    if(!empty($showAllAdmins)){
      $data['success'] = true;
      $data['message'] = "";
      $data['data'] = $showAllAdmins;
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function deleteUser(){
  if(!empty($_POST)){
    $deleteUser = $this->web_services_model->deleteUser($_POST);
    if($deleteUser==true){
      $to = $_POST['email'];
        $subject = "Account deleted";
        $message = "<h3>Hello user</h3><p>You account has been deleted.</p>";
        $headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
        mail($to,$subject,$message,$headers, '-f'.$this->web_services_model->mail_from);
      $data['success'] = true;
      $data['message'] = "User deleted";
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function activateUser(){
  if(!empty($_POST)){
    $activateUser = $this->web_services_model->activateUser($_POST);
    if($activateUser==true){
      $to = $_POST['email'];
        $subject = "Account activated";
        $message = "<h3>Hello user</h3><p>You account is active now. You can start posting events.</p>";
        $headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
        mail($to,$subject,$message,$headers, '-f'.$this->web_services_model->mail_from);
      $data['success'] = true;
      $data['message'] = "User activated";
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function deactivateUser(){
  if(!empty($_POST)){
    $deactivateUser = $this->web_services_model->deactivateUser($_POST);
    if($deactivateUser==true){
      $to = $_POST['email'];
        $subject = "Account dactivated";
        $message = "<h3>Hello user</h3><p>You account has been deactivated.</p>";
        $headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
        mail($to,$subject,$message,$headers, '-f'.$this->web_services_model->mail_from);
      $data['success'] = true;
      $data['message'] = "User deactivated";
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function deleteAdmin(){
  if(!empty($_POST)){
    $deleteAdmin = $this->web_services_model->deleteAdmin($_POST);
    if($deleteAdmin==true){
      $to = $_POST['email'];
        $subject = "Account deleted";
        $message = "<h3>Hello admin</h3><p>You account has been deleted.</p>";
        $headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
        mail($to,$subject,$message,$headers, '-f'.$this->web_services_model->mail_from);
      $data['success'] = true;
      $data['message'] = "User deleted";
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function editAdmin(){
  if(!empty($_POST)){
    $editAdmin = $this->web_services_model->editAdmin($_POST);
    if($editAdmin==true){
      $data['success'] = true;
      $data['message'] = "";
    }else{
      $data['success'] = false;
      $data['message'] = "No change was detected or not able to update.";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function editUser(){
  if(!empty($_POST)){
    $editUser = $this->web_services_model->editUser($_POST);
    if($editUser==true){
      $data['success'] = true;
      $data['message'] = "";
    }else{
      $data['success'] = false;
      $data['message'] = "No change was detected or not able to update.";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function getUserDate(){
  if(!empty($_POST)){
    $getUserDate = $this->web_services_model->getUserDate($_POST);
    if(!empty($getUserDate)){
      $data['success'] = true;
      $data['message'] = "";
      $data['data'] = $getUserDate[0];
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function getAdminData(){
  if(!empty($_POST)){
    $getAdminData = $this->web_services_model->getAdminData($_POST);
    if(!empty($getAdminData)){
      $data['success'] = true;
      $data['message'] = "";
      $data['data'] = $getAdminData[0];
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function editUserProfile(){
  if(!empty($_POST)){
    $editUserProfile = $this->web_services_model->editUserProfile($_POST);
    if($editUserProfile==true){
      $data['success'] = true;
      $data['message'] = "";
    }else{
      $data['success'] = false;
      $data['message'] = "No change was detected or not able to update.";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function editAdminProfile(){
  if(!empty($_POST)){
    $editAdminProfile = $this->web_services_model->editAdminProfile($_POST);
    if($editAdminProfile==true){
      $data['success'] = true;
      $data['message'] = "";
    }else{
      $data['success'] = false;
      $data['message'] = "No change was detected or not able to update.";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function uploadFile(){
    $attachment = $_FILES['attachment']['name'];
    $ext_file = pathinfo($attachment, PATHINFO_EXTENSION);
    $target_path = './uploads/event_files/';
    $target_path = $target_path.uniqid().$attachment;
    $upload = move_uploaded_file($_FILES["attachment"]["tmp_name"],$target_path);
    if($upload){
      $data['success'] = true;
      $data['filepath'] = base_url().ltrim($target_path, './');
      $data['extension'] = $ext_file;
    }else{
      $data['success'] = false;
      $data['error while uploading'];
    }
    echo json_encode($data);
 }

function uploadBannerImage(){
    $attachment = $_FILES['attachment']['name'];
    $ext_file = pathinfo($attachment, PATHINFO_EXTENSION);
    $target_path = './uploads/banner_images/';
    $target_path = $target_path.uniqid().$attachment;
    $upload = move_uploaded_file($_FILES["attachment"]["tmp_name"],$target_path);
    if($upload){
      $data['success'] = true;
      $data['filepath'] = base_url().ltrim($target_path, './');
      $data['extension'] = $ext_file;
    }else{
      $data['success'] = false;
      $data['error while uploading'];
    }
    echo json_encode($data);
 }

function uploadUserProfilePic(){
  if(isset($_POST['user_id'])){
    $profile_pic = $_FILES['profile_pic']['name'];
    $ext_file = pathinfo($profile_pic, PATHINFO_EXTENSION);
    $target_path = './uploads/profile_pic/';
    $target_path = $target_path.uniqid().$profile_pic;
    $upload = move_uploaded_file($_FILES["profile_pic"]["tmp_name"],$target_path);
    $filepath = base_url().ltrim($target_path, './');
    $uploadUserProfilePic = $this->web_services_model->uploadUserProfilePic($filepath, $_POST['user_id']);
    if($upload){
      $data['success'] = true;
      $data['filepath'] = $filepath;
      $data['extension'] = $ext_file;
    }else{
      $data['success'] = false;
      $data['error while uploading'];
    }
  }else{
    $data['success'] = false;
    $data['message'] = "User id not specified";
  }
    echo json_encode($data);
}

function uploadAdminProfilePic(){
  if(isset($_POST['admin_id'])){
    $profile_pic = $_FILES['profile_pic']['name'];
    $ext_file = pathinfo($profile_pic, PATHINFO_EXTENSION);
    $target_path = './uploads/profile_pic/';
    $target_path = $target_path.uniqid().$profile_pic;
    $upload = move_uploaded_file($_FILES["profile_pic"]["tmp_name"],$target_path);
    $filepath = base_url().ltrim($target_path, './');
    $uploadAdminProfilePic = $this->web_services_model->uploadAdminProfilePic($filepath, $_POST['admin_id']);
    if($upload){
      $data['success'] = true;
      $data['filepath'] = $filepath;
      $data['extension'] = $ext_file;
    }else{
      $data['success'] = false;
      $data['error while uploading'];
    }
  }else{
    $data['success'] = false;
    $data['message'] = "User id not specified";
  }
    echo json_encode($data);
}

 function notifyAdminRegister(){
  if(isset($_POST['user_id'])){
    $getUserDetails = $this->web_services_model->getUserDetails($_POST);
    if($getUserDetails!==false){
    $email = $getUserDetails[0]['email'];
    $first_name = $getUserDetails[0]['name'];
    $middle_name = $getUserDetails[0]['middle_name'];
    $last_name = $getUserDetails[0]['last_name'];
    $title = $getUserDetails[0]['title'];
    $organization = $getUserDetails[0]['organization'];
    $phone = $getUserDetails[0]['phone'];
    $reg_time = $getUserDetails[0]['reg_time'];
    $getAdminList = $this->web_services_model->getAdminList();
    if(!empty($getAdminList)){
      foreach($getAdminList as $admin){
        $to = $admin['email'];
        $subject = "New Users";
        $message = "<h3>There is a new registration waiting for approval.</h3>";
        $message.= "<p>First name: ".$first_name."</p>";
        $message.= "<p>Middle name: ".$middle_name."</p>";
        $message.= "<p>Last name: ".$last_name."</p>";
        $message.= "<p>Title: ".$title."</p>";
        $message.= "<p>Organization: ".$organization."</p>";
        $message.= "<p>Phone number: ".$phone."</p>";
        $message.= "<p>Registration Date: ".date('M-d-Y', $reg_time)."</p>";
        $headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
        mail($to,$subject,$message,$headers, '-f'.$this->web_services_model->mail_from);
      }
    }

  }
  }
}

function notifyAdminEvent(){
  if(isset($_POST['event_id'])){
    $getUserEventDetails = $this->web_services_model->getUserEventDetails($_POST);
    if($getUserEventDetails!==false){
    $title = $getUserEventDetails[0]['title'];
    $description = $getUserEventDetails[0]['description'];
    $start_date = $getUserEventDetails[0]['start_date'];
    $start_time = $getUserEventDetails[0]['start_time'];
    $end_date = $getUserEventDetails[0]['end_date'];
    $end_time = $getUserEventDetails[0]['end_time'];
    $categories = $getUserEventDetails[0]['categories'];
    $location = $getUserEventDetails[0]['location'];
    $link = $getUserEventDetails[0]['link'];
    $contact_name = $getUserEventDetails[0]['contact_name'];
    $contact_number = $getUserEventDetails[0]['contact_number'];
    $recurring_type = $getUserEventDetails[0]['recurring_type'];
    $getAdminList = $this->web_services_model->getAdminList();
    if(!empty($getAdminList)){
      foreach($getAdminList as $admin){
        $to = $admin['email'];
        $subject = "New Event";
        $message = "<h3>There is a new event waiting for approval.</h3>";
        $message.= "<p>Title: ".$title."</p>";
        $message.= "<p>Description: ".$description."</p>";
        $message.= "<p>Location: ".$location."</p>";
        $message.= "<p>Start Date: ".$start_date." ".$start_time."</p>";
        $message.= "<p>End Date: ".$end_date." ".$end_time."</p>";
        $message.= "<p>Categories: ".$categories."</p>";
        $message.= "<p>Recurring Type: ".$recurring_type."</p>";
        $message.= "<p>Link: ".$link."</p>";
        $message.= "<p>Contact name: ".$contact_name."</p>";
        $message.= "<p>Contact number: ".$contact_number."</p>";
        $headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
        mail($to,$subject,$message,$headers, '-f'.$this->web_services_model->mail_from);
        }
      }
    }
  }
}

function notifyAdminEventModify(){
  if(isset($_POST['event_id'])){
    $getUserModifyEventDetails = $this->web_services_model->getUserModifyEventDetails($_POST);
    if($getUserModifyEventDetails!==false){
    $title = $getUserModifyEventDetails[0]['title'];
    $description = $getUserModifyEventDetails[0]['description'];
    $start_date = $getUserModifyEventDetails[0]['start_date'];
    $start_time = $getUserModifyEventDetails[0]['start_time'];
    $end_date = $getUserModifyEventDetails[0]['end_date'];
    $end_time = $getUserModifyEventDetails[0]['end_time'];
    $categories = $getUserModifyEventDetails[0]['categories'];
    $location = $getUserModifyEventDetails[0]['location'];
    $link = $getUserModifyEventDetails[0]['link'];
    $contact_name = $getUserModifyEventDetails[0]['contact_name'];
    $contact_number = $getUserModifyEventDetails[0]['contact_number'];
    $recurring_type = $getUserModifyEventDetails[0]['recurring_type'];
    $getAdminList = $this->web_services_model->getAdminList();
    if(!empty($getAdminList)){
      foreach($getAdminList as $admin){
        $to = $admin['email'];
        $subject = "New Event";
        $message = "<h3>There is a new event waiting for approval.</h3>";
        $message.= "<p>Title: ".$title."</p>";
        $message.= "<p>Description: ".$description."</p>";
        $message.= "<p>Location: ".$location."</p>";
        $message.= "<p>Start Date: ".$start_date." ".$start_time."</p>";
        $message.= "<p>End Date: ".$end_date." ".$end_time."</p>";
        $message.= "<p>Categories: ".$categories."</p>";
        $message.= "<p>Recurring Type: ".$recurring_type."</p>";
        $message.= "<p>Link: ".$link."</p>";
        $message.= "<p>Contact name: ".$contact_name."</p>";
        $message.= "<p>Contact number: ".$contact_number."</p>";
        $headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
        mail($to,$subject,$message,$headers, '-f'.$this->web_services_model->mail_from);
        }
      }
    }
  }
}

function notifyUsersTerms(){
    $getUserList = $this->web_services_model->getUserList();
    if(!empty($getUserList)){
      $site_url = $this->web_services_model->site_url;
      $url = $site_url.'terms_and_condition';
      foreach($getUserList as $admin){
        $to = $admin['email'];
        $subject = "Terms and condition updated";
        $message = "<p>Important updates to our Terms and Conditions have been made. You can read about the changes to the Terms and Conditions here.</p><br><a href='".$url."' target='_balnk'>Terms and condition</a>";
        $headers = 'From: cityoflaredocalendar.com <'.$this->web_services_model->mail_from . ">\r\n" . 'Reply-To: '.$this->web_services_model->mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion(). "MIME-Version: 1.0" . "\r\n"   . "Content-type:text/html;charset=UTF-8" . "\r\n"; 
        mail($to,$subject,$message,$headers, '-f'.$this->web_services_model->mail_from);
      }
    }
}

function changeUserPassword(){
  if(!empty($_POST)){
    $changeUserPassword = $this->web_services_model->changeUserPassword($_POST);
    if($changeUserPassword=='changed'){
      $data['success'] = true;
      $data['message'] = "";
    }else if($changeUserPassword=='incorrect'){
      $data['success'] = false;
      $data['message'] = "Incorrect old password.";
    }else if($changeUserPassword==false){
      $data['success'] = false;
      $data['message'] = "Something went wrong.";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function adminChangeUserPassword(){
  if(!empty($_POST)){
    $adminChangeUserPassword = $this->web_services_model->adminChangeUserPassword($_POST);
    if($adminChangeUserPassword==true){
      $data['success'] = true;
      $data['message'] = "";
    }else if($adminChangeUserPassword==false){
      $data['success'] = false;
      $data['message'] = "Something went wrong.";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function adminChangeAdminPassword(){
  if(!empty($_POST)){
    $adminChangeAdminPassword = $this->web_services_model->adminChangeAdminPassword($_POST);
    if($adminChangeAdminPassword==true){
      $data['success'] = true;
      $data['message'] = "";
    }else if($adminChangeAdminPassword==false){
      $data['success'] = false;
      $data['message'] = "Something went wrong.";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function changeAdminPassword(){
  if(!empty($_POST)){
    $changeAdminPassword = $this->web_services_model->changeAdminPassword($_POST);
    if($changeAdminPassword=='changed'){
      $data['success'] = true;
      $data['message'] = "";
    }else if($changeAdminPassword=='incorrect'){
      $data['success'] = false;
      $data['message'] = "Incorrect old password.";
    }else if($changeAdminPassword==false){
      $data['success'] = false;
      $data['message'] = "Something went wrong.";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function getTermsText(){
    $getTermsText = $this->web_services_model->getTermsText();
    if(!empty($getTermsText)){
      $data['success'] = true;
      $data['message'] = "";
      $data['data'] = $getTermsText[0]['text'];
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  echo json_encode($data);
}

function getPrivacyPolicyText(){
    $getPrivacyPolicyText = $this->web_services_model->getPrivacyPolicyText();
    if(!empty($getPrivacyPolicyText)){
      $data['success'] = true;
      $data['message'] = "";
      $data['data'] = $getPrivacyPolicyText[0]['text'];
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  echo json_encode($data);
}

function updateTermsText(){
  if(!empty($_POST)){
    $updateTermsText = $this->web_services_model->updateTermsText($_POST);
    if($updateTermsText==true){
      $data['success'] = true;
      $data['message'] = "";
    }else{
      $data['success'] = false;
      $data['message'] = "No change was detected or not able to update.";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function updatePrivacyText(){
  if(!empty($_POST)){
    $updatePrivacyText = $this->web_services_model->updatePrivacyText($_POST);
    if($updatePrivacyText==true){
      $data['success'] = true;
      $data['message'] = "";
    }else{
      $data['success'] = false;
      $data['message'] = "No change was detected or not able to update.";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function getBannerImages(){
    $getBannerImages = $this->web_services_model->getBannerImages();
    if(!empty($getBannerImages)){
      $data['success'] = true;
      $data['message'] = "";
      $data['data'] = $getBannerImages[0];
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong";
    }
  echo json_encode($data);
}

function saveBannerImages(){
  if(!empty($_POST)){
    $saveBannerImages = $this->web_services_model->saveBannerImages($_POST);
    if($saveBannerImages==true){
      $data['success'] = true;
      $data['message'] = "";
    }else{
      $data['success'] = false;
      $data['message'] = "Something went wrong.";
    }
  }else{
    $data['success'] = false;
    $data['message'] = "Parameters missing";
  }
  echo json_encode($data);
}

function deleteSixMonthOldEvents(){
  $deleteSixMonthOldEvents = $this->web_services_model->deleteSixMonthOldEvents();
}

function testHeader(){
  $checkAccessToken = $this->checkAccessToken();
  echo $checkAccessToken;
}

}
?>