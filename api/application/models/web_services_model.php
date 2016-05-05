<?php 
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Web_services_model extends CI_Model{

public $site_url = "http://localhost:3000/";
//public $mail_from = "nimit.geetkech@cityoflaredocalendar.com";
public $mail_from = "support@cityoflaredocalendar.com";
public $site_name = "www.cityoflaredocalendar.com";
/****************Authentication********************/

  function checkUser($email){
    $this -> db -> select('user_id');
   $this -> db -> from('users');
   $this -> db -> where('email', $email);
   $query = $this -> db -> get();

   if($query -> num_rows() == 0)
   {
     return true;
   }
   else
   {
     return false;
   }
 }

 function registerUser($data){
    $res1 =  $this->db->insert('users',$data);
    $user_id =   $this->db->insert_id(); 
    if(!empty($res1))
    {
      return $user_id;
    }
    else
    {
      return false;
    }
 }

 function createUser($data){
    $res1 =  $this->db->insert('users',$data);
    $user_id =   $this->db->insert_id(); 
    if(!empty($res1))
    {
      return $user_id;
    }
    else
    {
      return false;
    }
 }

function checkAdmin($email){
    $this -> db -> select('user_id');
   $this -> db -> from('users');
   $this -> db -> where('email', $email);
   $query = $this -> db -> get();

   if($query -> num_rows() == 0)
   {
     return true;
   }
   else
   {
     return false;
   }
 }

function registerAdmin($data){
    $res1 =  $this->db->insert('users',$data);
    $user_id =   $this->db->insert_id(); 
    if(!empty($res1))
    {
      return $user_id;
    }
    else
    {
      return false;
    }
}

function loginUser($email, $password){
    $pass = md5($password);
    $query = "SELECT user_id, CONCAT(name, ' ', last_name) as fullname, email, type, account_status, profile_pic FROM users WHERE email='$email' AND password='$pass' AND type='user'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
  {
    $fetch = $q->result_array();
     if($fetch[0]['account_status']=='active'){
      return $fetch;
     }else{
      return 'Your account is status '.$fetch[0]['account_status'];
     }
  }
  else
  {
     return 'Invalid credentials';
  }
}

function loginSubAdmin($email, $password){
    $pass = md5($password);
    $query = "SELECT user_id as admin_id, fullname, email, type, profile_pic FROM users WHERE email='$email' AND password='$pass' AND type='sub'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
   {
     return $q->result();
   }
   else
   {
     return array();
   }
}

function loginAdmin($email, $password){
    $pass = md5($password);
    $query = "SELECT user_id as admin_id, fullname, email, type, profile_pic FROM users WHERE email='$email' AND password='$pass' AND type='master'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
   {
     return $q->result();
   }
   else
   {
     return array();
  }
}

/**********Events******************/

function addEvent($post){
  $data['title'] = $post['title'];
  $data['description'] = $post['description'];
  $data['start_date'] = $post['start_date'];
  $data['end_date'] = $post['end_date'];
  $data['status'] = 'pending';
  $data['user_id'] = $post['user_id'];
  $data['categories'] = $post['categories'];
  $data['location'] = $post['location'];
  $data['added_date'] = time();
  $data['attachments'] = $post['attachments'];
  $data['recurring_type'] = $post['recurring_type'];
  $data['recurring_days'] = $post['recurring_days'];
  $data['start_time'] = $post['start_time'];
  $data['end_time'] = $post['end_time'];
  $data['month_recurring'] = $post['month_recurring'];
  $data['link'] = $post['link'];
  $data['contact_name'] = $post['contact_name'];
  $data['contact_number'] = $post['contact_number'];
  $res =  $this->db->insert('events',$data);
    $event_id = $this->db->insert_id(); 
    if(!empty($res))
    {
      return $event_id;
    }
    else
    {
      return false;
    }
}

function addEventAdmin($post){
  $data['title'] = $post['title'];
  $data['description'] = $post['description'];
  $data['start_date'] = $post['start_date'];
  $data['end_date'] = $post['end_date'];
  $data['status'] = 'approved';
  $data['user_id'] = $post['user_id'];
  $data['categories'] = $post['categories'];
  $data['location'] = $post['location'];
  $data['added_date'] = time();
  $data['attachments'] = $post['attachments'];
  $data['recurring_type'] = $post['recurring_type'];
  $data['recurring_days'] = $post['recurring_days'];
  $data['start_time'] = $post['start_time'];
  $data['end_time'] = $post['end_time'];
  $data['month_recurring'] = $post['month_recurring'];
  $data['link'] = $post['link'];
  $data['contact_name'] = $post['contact_name'];
  $data['contact_number'] = $post['contact_number'];
  $res =  $this->db->insert('events',$data);
    $event_id = $this->db->insert_id(); 
    if(!empty($res))
    {
      return $event_id;
    }
    else
    {
      return false;
    }
}

function adminEditEvent($post){
    $event_id = $post['event_id'];
    $this->db->where('event_id', $event_id);
    $this->db->update('events', $post);
    if($this->db->affected_rows()>0)
    {
      return true;
    }
    else
    {
      return false;
    }
}

function userEditPendingEvent($post){
    $event_id = $post['event_id'];
    $this->db->where('event_id', $event_id);
    $this->db->where('status', 'pending');
    $this->db->update('events', $post);
    if($this->db->affected_rows()>0)
    {
      return true;
    }
    else
    {
      return false;
    }
}

function userEditApprovedEvent($post){
  $event_id = $post['event_id'];
  $user_id = $post['user_id'];
    $query = "SELECT categories FROM events WHERE event_id='$event_id' AND user_id='$user_id' AND status='approved'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0){
      $query1 = "SELECT categories FROM modified_events WHERE event_id='$event_id' AND user_id='$user_id' AND status='modified'";
      $q1=$this->db->query($query1);
      if($q1 -> num_rows()>0){
            $this->db->where('event_id', $event_id);
              $this->db->where('user_id', $user_id);
              $this->db->update('modified_events', $post);
              if($this->db->affected_rows()>0)
              {
                return true;
              }
              else
              {
                return false;
              }
      }else{
        $res1 =  $this->db->insert('modified_events',$post);
          if(!empty($res1))
          {
            return true;
          }
          else
          {
            return false;
          }
      }
    }else{
      return false;
    }
}

function showUserEvents($post){
  $user_id = $post['user_id'];
    $query = "SELECT * FROM events WHERE user_id='$user_id'";
    $q=$this->db->query($query);
    if($q)
   {
    $events = $q->result();
     $query1 = "SELECT * FROM modified_events WHERE user_id='$user_id'";
    $q1=$this->db->query($query1);
    if($q1)
     {
       $modified_events = $q1->result();
       $total_events = array_merge($events, $modified_events);
       return $total_events;
     }else{
      return $events;
     }
   }
   else
   {
     return false;
  }
}

function showEventAttachments($event_id){
  $query = "SELECT sr_no, event_id, path FORM attachments WHERE event_id='$event_id'";
  $q=$this->db->query($query);
    if($q -> num_rows() > 0)
   {
     return $q->result();
   }
   else
   {
     return false;
  }
}

function showAllEvents($post){
    $query = "SELECT e.event_id, e.status, e.title, e.start_date, e.start_time, e.end_date, e.end_time, e.description, e.categories, e.attachments, e.location, e.recurring_type, e.recurring_days, e.month_recurring, e.link, e.contact_name, e.contact_number, u.name, u.last_name, u.user_id FROM events as e INNER JOIN users as u ON u.user_id=e.user_id";
    $q=$this->db->query($query);
    if($q)
   {
     $events = $q->result();
     $query1 = "SELECT e.event_id, e.status, e.title, e.start_date, e.end_date, e.start_time, e.end_time, e.description, e.categories, e.attachments, e.location, e.recurring_type, e.recurring_days, e.month_recurring, e.link, e.contact_name, e.contact_number, u.name, u.last_name, u.user_id FROM modified_events as e INNER JOIN users as u ON u.user_id=e.user_id";
      $q1=$this->db->query($query1);
      if($q1)
     {
       $modified_events = $q1->result();
       $total_events = array_merge($events, $modified_events);
       return $total_events;
     }else{
      return $events;
     }
   }
   else
   {
     return false;
    }
}

function showApprovedEvents($post){
    $query = "SELECT e.event_id, e.status, e.title, e.start_date, e.start_time, e.end_date, e.end_time, e.description, e.location, e.recurring_type, e.recurring_days, e.attachments, e.categories, e.month_recurring, e.link, e.contact_name, e.contact_number, u.fullname, u.user_id FROM events as e INNER JOIN users as u ON u.user_id=e.user_id WHERE e.status='approved'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
   {
     return $q->result();
   }
   else
   {
     return array();
  }
}

function searchApprovedEvents($post){
  $category = $post['category'];
  $category_array = explode(',', $category);
  $custom_query = 'AND (';
  foreach($category_array as $cat){
    $custom_query.= " e.categories LIKE '%$cat%' OR";
  }
  $custom_query = rtrim($custom_query, 'OR');
  $custom_query = $custom_query.')';
    $query = "SELECT e.event_id, e.status, e.title, e.start_date, e.start_time, e.end_date, e.end_time, e.description, e.location, e.attachments, e.categories, e.recurring_type, e.recurring_days, e.month_recurring, e.link, e.contact_name, e.contact_number, u.fullname, u.user_id FROM events as e INNER JOIN users as u ON u.user_id=e.user_id WHERE e.status='approved' $custom_query  ORDER BY start_date asc";
    $q=$this->db->query($query);
    if($q)
   {
     return $q->result();
   }
   else
   {
     return false;
  }
}

function textSearchApprovedEvents($post){
  $keyword = $post['keyword'];
    $query = "SELECT e.event_id, e.status, e.title, e.start_date, e.start_time, e.end_date, e.end_time, e.description, e.location, e.attachments, e.categories, e.recurring_type, e.recurring_days, e.month_recurring, e.link, e.contact_name, e.contact_number, u.fullname, u.user_id FROM events as e INNER JOIN users as u ON u.user_id=e.user_id WHERE e.status='approved' AND (e.title LIKE '%$keyword%' OR e.location LIKE '%$keyword%' OR e.description LIKE '%$keyword%' OR e.categories LIKE '%$keyword%' ORDER BY start_date asc)";
    $q=$this->db->query($query);
    if($q)
   {
     return $q->result();
   }
   else
   {
     return false;
  }
}


function showAllUsers($post){
    $query = "SELECT * FROM users WHERE type='user'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
   {
     return $q->result();
   }
   else
   {
     return array();
  }
}

function showAllAdmins($post){
    $query = "SELECT * FROM users WHERE type='sub'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
   {
     return $q->result();
   }
   else
   {
     return array();
  }
}

function getAdminList(){
    $query = "SELECT email FROM users";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
   {
     return $q->result_array();
   }
   else
   {
     return array();
  }
}

function getUserList(){
    $query = "SELECT email FROM users";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
   {
     return $q->result_array();
   }
   else
   {
     return array();
  }
}

function deleteEvent($post){
  $event_id = $post['event_id'];
    $q = "DELETE FROM events WHERE event_id='$event_id'";
     $query = $this->db->query($q);
      if($query){
        return true;
      }else{
      return false;
    }
}

function approveEvent($post){
  $event_id = $post['event_id'];
    $q = "UPDATE events SET status='approved' WHERE event_id='$event_id'";
     $query = $this->db->query($q);
      if($query){
        $query2 = "SELECT e.title, u.email, u.name FROM events as e INNER JOIN users as u ON u.user_id=e.user_id WHERE e.event_id='$event_id'";
          $q2=$this->db->query($query2);
          if($q2 -> num_rows() > 0)
         {
           return $q2->result_array();
         }
         else
         {
           return array();
        }
        return true;
      }else{
      return false;
    }
}

function approveModifiedEvent($post){
  $event_id = $post['event_id'];
  $status = $post['status'];
    $q = "SELECT * FROM modified_events WHERE event_id='$event_id' AND status='$status'";
     $query = $this->db->query($q);
      if($query){
        $fetch = $query->result_array();
        $data['title']=$fetch[0]['title'];
        $data['description']=$fetch[0]['description'];
        $data['start_date']=$fetch[0]['start_date'];
        $data['start_date']=$fetch[0]['end_date'];
        $data['categories']=$fetch[0]['categories'];
        $data['location']=$fetch[0]['location'];
        $data['attachments']=$fetch[0]['attachments'];
        $data['recurring_type']=$fetch[0]['recurring_type'];
        $data['recurring_days']=$fetch[0]['recurring_days'];
        $data['link'] = $fetch[0]['link'];
        $data['contact_name'] = $fetch[0]['contact_name'];
        $data['contact_number'] = $fetch[0]['contact_number'];
        $this->db->where('event_id', $event_id);
        $this->db->where('status', 'approved');
        $this->db->update('events', $data);
          if($this->db->affected_rows()>0)
          {
            $q3 = "DELETE FROM modified_events WHERE event_id='$event_id' AND status='$status'";
            $query3 = $this->db->query($q3);
            if($query3){
                  $query2 = "SELECT e.title, u.email, u.name FROM events as e INNER JOIN users as u ON u.user_id=e.user_id WHERE e.event_id='$event_id'";
                    $q2=$this->db->query($query2);
                    if($q2 -> num_rows() > 0)
                   {
                     return $q2->result_array();
                   }
                   else
                   {
                     return array();
                  }
                  return true;
            }else{
              return false;
            }
          }
          else
          {
                return false;
          }
      }else{
        return false;
      }
////

}

function declineEvent($post){
  $event_id = $post['event_id'];
    $q = "UPDATE events SET status='declined' WHERE event_id='$event_id'";
     $query = $this->db->query($q);
      if($query){
        $query2 = "SELECT e.title, u.email, u.name FROM events as e INNER JOIN users as u ON u.user_id=e.user_id WHERE e.event_id='$event_id'";
          $q2=$this->db->query($query2);
          if($q2 -> num_rows() > 0)
         {
           return $q2->result_array();
         }
         else
         {
           return array();
        }
        return true;
      }else{
      return false;
    }
}

function declineEventModified($post){
  $event_id = $post['event_id'];
  $status = $post['status'];
    $q = "DELETE FROM modified_events WHERE event_id='$event_id' AND status='$status'";
     $query = $this->db->query($q);
      if($query){
        $query2 = "SELECT e.title, u.email, u.name FROM events as e INNER JOIN users as u ON u.user_id=e.user_id WHERE e.event_id='$event_id'";
          $q2=$this->db->query($query2);
          if($q2 -> num_rows() > 0)
         {
           return $q2->result_array();
         }
         else
         {
           return array();
        }
        return true;
      }else{
      return false;
    }
}

function requestPassword($email){
  $token = uniqid();
  $query = "SELECT user_id FROM users WHERE email='$email'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
  {
     $fetch = $q->result_array();
     $data['user_id'] = $fetch[0]['user_id'];
     $data['token'] = $token;
     $data['valid_till'] = time()+3600;
     $res =  $this->db->insert('recover_password',$data);
      if(!empty($res))
      {
        return $token;
      }
      else
      {
        return false;
      }
  }
  else
  {
     return false;
  }
}

function adminRequestPassword($email){
  $token = uniqid();
  $query = "SELECT user_id as admin_id FROM users WHERE email='$email'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
  {
     $fetch = $q->result_array();
     $data['admin_id'] = $fetch[0]['admin_id'];
     $data['token'] = $token;
     $data['valid_till'] = time()+3600;
     $res =  $this->db->insert('recover_password_admin',$data);
      if(!empty($res))
      {
        return $token;
      }
      else
      {
        return false;
      }
  }
  else
  {
     return false;
  }
}

function updateUserPassword($pass, $token){
    $query = "SELECT user_id FROM recover_password WHERE token='$token' order by sr_no desc limit 1";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
  {
     $fetch = $q->result_array();
     $user_id = $fetch[0]['user_id'];
     $q = "UPDATE users SET password='$pass' WHERE user_id='$user_id'";
     $query = $this->db->query($q);
      if($query){
      $q2 = "DELETE FROM recover_password WHERE user_id='$user_id'";
      $query = $this->db->query($q2);
      if($query){
        return true;
      }else{
        return false;
      }
      }else{
        return false;
      }
  }
  else
  {
     return false;
  }
}

function resetAdminPassword($pass, $token){
    $query = "SELECT admin_id FROM recover_password_admin WHERE token='$token' order by sr_no desc limit 1";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
  {
     $fetch = $q->result_array();
     $admin_id = $fetch[0]['admin_id'];
     $q = "UPDATE users SET password='$pass' WHERE user_id='$admin_id'";
     $query = $this->db->query($q);
      if($query){
      $q2 = "DELETE FROM recover_password_admin WHERE admin_id='$admin_id'";
      $query = $this->db->query($q2);
      if($query){
        return true;
      }else{
        return false;
      }
      }else{
        return false;
      }
  }
  else
  {
     return false;
  }
}

function deleteUser($post){
  $user_id = $post['user_id'];
    $q = "DELETE FROM users WHERE user_id='$user_id'";
     $query = $this->db->query($q);
      if($query){
        $this->deleteAllUserEvents($user_id);
        return true;
      }else{
      return false;
    }
}

function deleteAllUserEvents($user_id){
  $q = "DELETE FROM events WHERE user_id='$user_id'";
  $q1 = "DELETE FROM modified_events WHERE user_id='$user_id'";
   $query = $this->db->query($q);
   $query1 = $this->db->query($q1);
}

function activateUser($post){
  $user_id = $post['user_id'];
    $q = "UPDATE users SET account_status='active' WHERE user_id='$user_id'";
     $query = $this->db->query($q);
      if($query){
        return true;
      }else{
      return false;
    }
}

function deactivateUser($post){
  $user_id = $post['user_id'];
    $q = "UPDATE users SET account_status='inactive' WHERE user_id='$user_id'";
     $query = $this->db->query($q);
      if($query){
        return true;
      }else{
      return false;
    }
}

function deleteAdmin($post){
  $admin_id = $post['admin_id'];
    $q = "DELETE FROM users WHERE user_id='$admin_id' AND type='sub'";
     $query = $this->db->query($q);
      if($query){
        return true;
      }else{
      return false;
    }
}

function getUserDate($post){
    $user_id = $post['user_id'];
    $query = "SELECT * FROM users WHERE user_id='$user_id'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
   {
     return $q->result();
   }
   else
   {
     return array();
  }
}

function getAdminData($post){
    $admin_id = $post['admin_id'];
    $query = "SELECT fullname, user_id as admin_id, email, profile_pic FROM users WHERE user_id='$admin_id'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
   {
     return $q->result();
   }
   else
   {
     return array();
  }
}

function editUserProfile($post){
  $user_id = $post['user_id'];
   $this->db->where('user_id', $user_id);
    $this->db->update('users', $post); 
    if($this->db->affected_rows()>0)
    {
      return true;
    }
    else
    {
      return false;
    }
}

function editAdminProfile($post){
  $user_id = $post['user_id'];
   $this->db->where('user_id', $user_id);
    $this->db->update('users', $post); 
    if($this->db->affected_rows()>0)
    {
      return true;
    }
    else
    {
      return false;
    }
}

function uploadUserProfilePic($path, $user_id){
   $data['profile_pic'] = $path;
   $this->db->where('user_id', $user_id);
    $this->db->update('users', $data); 
    if($this->db->affected_rows()>0)
    {
      return true;
    }
    else
    {
      return false;
    }
}

function uploadAdminProfilePic($path, $admin_id){
   $data['profile_pic'] = $path;
   $this->db->where('user_id', $admin_id);
    $this->db->update('users', $data); 
    if($this->db->affected_rows()>0)
    {
      return true;
    }
    else
    {
      return false;
    }
}

function editAdmin($post){
  $user_id = $post['user_id'];
  $data['fullname'] = $post['fullname'];
  $data['email'] = $post['email'];
   $this->db->where('user_id', $user_id);
    $this->db->update('users', $data); 
    if($this->db->affected_rows()>0)
    {
      return true;
    }
    else
    {
      return false;
    }
}

function editUser($post){
  $user_id = $post['user_id'];
  $data['name'] = $post['name'];
  $data['last_name'] = $post['last_name'];
  $data['middle_name'] = $post['middle_name'];
  $data['organization'] = $post['organization'];
  $data['title'] = $post['title'];
  $data['phone'] = $post['phone'];
  $data['email'] = $post['email'];
   $this->db->where('user_id', $user_id);
    $this->db->update('users', $data); 
    if($this->db->affected_rows()>0)
    {
      return true;
    }
    else
    {
      return false;
    }
}

function changeUserPassword($post){
  $old_password = md5($post['old_password']);
  $user_id = $post['user_id'];
  $check_pass = "SELECT email FROM users WHERE user_id='$user_id' AND password='$old_password'";
  $q=$this->db->query($check_pass);
    if($q -> num_rows() > 0)
   {
    $data['password'] = md5($post['new_password']);
    $data['user_id'] = $user_id;
      $this->db->where('user_id', $user_id);
      $this->db->update('users', $data); 
      if($this->db->affected_rows()>0)
      {
        return 'changed';
      }
      else
      {
        return false;
      }
   }else{
    return 'incorrect';
   }
}

function adminChangeUserPassword($post){
  $user_id = $post['user_id'];
    $data['password'] = md5($post['password']);
      $this->db->where('user_id', $user_id);
      $this->db->update('users', $data); 
      if($this->db->affected_rows()>0)
      {
        return true;
      }
      else
      {
        return false;
      }
}

function changeAdminPassword($post){
  $old_password = md5($post['old_password']);
  $admin_id = $post['admin_id'];
  $type = $post['type'];
  $check_pass = "SELECT email FROM users WHERE user_id='$admin_id' AND type='$type' AND password='$old_password'";
  $q=$this->db->query($check_pass);
    if($q -> num_rows() > 0)
   {
    $data['password'] = md5($post['new_password']);
    $data['user_id'] = $admin_id;
      $this->db->where('user_id', $admin_id);
      $this->db->where('type', $type);
      $this->db->update('users', $data); 
      if($this->db->affected_rows()>0)
      {
        return 'changed';
      }
      else
      {
        return false;
      }
   }else{
    return 'incorrect';
   }
}

function adminChangeAdminPassword($post){
  $user_id = $post['user_id'];
    $data['password'] = md5($post['password']);
      $this->db->where('user_id', $user_id);
      $this->db->update('users', $data); 
      if($this->db->affected_rows()>0)
      {
        return true;
      }
      else
      {
        return false;
      }
}

function getTermsText(){
    $query = "SELECT text FROM terms_and_condition WHERE id='1'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
   {
     return $q->result_array();
   }
   else
   {
     return array();
  }
}

function getPrivacyPolicyText(){
    $query = "SELECT text FROM privacy_policy WHERE id='1'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
   {
     return $q->result_array();
   }
   else
   {
     return array();
  }
}

function updateTermsText($post){
    $this->db->where('id', 1);
    $data['text'] = $post['text'];
    $this->db->update('terms_and_condition', $data); 
    if($this->db->affected_rows()>0)
    {
      return true;
    }
    else
    {
      return false;
    }
}

function updatePrivacyText($post){
    $this->db->where('id', 1);
    $data['text'] = $post['text'];
    $this->db->update('privacy_policy', $data); 
    if($this->db->affected_rows()>0)
    {
      return true;
    }
    else
    {
      return false;
    }
}

function getBannerImages(){
    $query = "SELECT images FROM banner_images WHERE id='1'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
   {
     return $q->result();
   }
   else
   {
     return array();
  }
}

function saveBannerImages($post){
    $data['images'] = $post['images'];
    $this->db->where('id', 1); 
    $this->db->update('banner_images', $data); 
    if($this->db->affected_rows()>0)
    {
      return true;
    }
    else
    {
      return false;
    }
}

function getUserDetails($post){
    $user_id = $post['user_id'];
    $query = "SELECT * FROM users WHERE user_id='$user_id'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
  {
    return $q->result_array();
  }
  else
  {
     return false;
  }
}

function getUserEventDetails($post){
    $event_id = $post['event_id'];
    $query = "SELECT * FROM events WHERE event_id='$event_id'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
  {
    return $q->result_array();
  }
  else
  {
     return false;
  }
}

function getUserModifyEventDetails($post){
    $event_id = $post['event_id'];
    $query = "SELECT * FROM modified_events WHERE event_id='$event_id'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
  {
    return $q->result_array();
  }
  else
  {
     return false;
  }
}

function deleteSixMonthOldEvents(){
  $query = "SELECT DATEDIFF(now(), end_date) as days, event_id FROM events WHERE end_date<now() HAVING days>'180'";
  $q=$this->db->query($query);
  if($q -> num_rows() > 0)
  {
    $fetch = $q->result_array();
    foreach($fetch as $row){
      $event_id = $row['event_id'];
      $query1 = "DELETE FROM events WHERE event_id='$event_id'";
      $q1=$this->db->query($query1);
    }
  }
  else
  {
     return false;
  }
}

}
?>