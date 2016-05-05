<?php 
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class LoginModel extends CI_Model{
	 function login($email, $password)
 {
   $this -> db -> select('user_id, firstname, lastname, email, time');
   $this -> db -> from('register_user');
   $this -> db -> where('email', $email);
   $this -> db -> where('password', md5($password));
   $this -> db -> where('validate', '1');
   $this -> db -> limit(1);

   $query = $this -> db -> get();

   if($query -> num_rows() == 1)
   {
     return $query->result();
   }
   else
   {
     return false;
   }
 }

}
?>