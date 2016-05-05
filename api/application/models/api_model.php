<?php 
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class api_model extends CI_Model{

function getRules($id){
    $query = "SELECT cf.field_rules, c.camp_id, c.success_url, c.fail_url, c.status FROM campaign_fields as cf INNER JOIN campaigns as c ON c.camp_id=cf.camp_id WHERE c.campaign_url_id='$id'";
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

function saveForm($values, $camp_id, $email){
    $data['camp_id'] = $camp_id;
    $data['form_values'] = $values;
    $data['email'] = $email;
    $data['time'] = time();
    $data['date'] = date('Y-m-d', time());
    $res1 =  $this->db->insert('registered_leads',$data);
    if(!empty($res1)){
      $id =   $this->db->insert_id(); 
     return $id;
    }else{
      return false;
    }
}

function updateCampaignStats($camp_id, $type){
    if($type=='success'){
    $query = "UPDATE campaign_stats SET success_count=success_count+1 WHERE camp_id='$camp_id'";
    }else{
    $query = "UPDATE campaign_stats SET success_count=fail_count+1 WHERE camp_id='$camp_id'";
    }
    $q=$this->db->query($query);
    if($q)
   {
     return true;
   }
   else
   {
     return false;
   }
}

function checkLeadExist($email, $camp_id){
      $query = "SELECT lead_id FROM registered_leads WHERE email='$email' AND camp_id='$camp_id'";
    $q=$this->db->query($query);
    if($q -> num_rows() > 0)
     {
       return true;
     }
     else
     {
       return false;
     }
}

function getPartners($camp_id){
  $query = "SELECT partners FROM campaign_partners WHERE camp_id='$camp_id'";
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

function forwarLeadSuccess($partner_id, $camp_id, $lead_id, $url_id, $type){
    $data['camp_id'] = $camp_id;
    $data['partner_id'] = $partner_id;
    $data['lead_id'] = $lead_id;
    $data['url_id'] = $url_id;
    $data['type'] = $type;
    $data['time'] = time();
    $data['date'] = date('Y-m-d', time());
    $res1 =  $this->db->insert('forwarded_leads',$data);
    if(!empty($res1)){
     return true;
    }else{
      return false;
    }
}

function getPartnerFields($partner_id){
  $query = "SELECT fields, url, url_id FROM partner_url WHERE partner_id='$partner_id'";
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

function addPendingLead($partners, $lead_id){
  $partners_array = explode(',', $partners);
  foreach($partners_array as $value){
    $data['pending_partners_url'] = $value;
    $data['lead_id'] = $lead_id;
    $res1 =  $this->db->insert('pending_leads',$data);
  }

    if(!empty($res1)){
     return true;
    }else{
      return false;
    }
}

function partnerStatsUpdate($camp_id, $partner_id, $type){
  $query = "SELECT sr_no FROM partner_stats WHERE camp_id='$camp_id' AND partner_id='$partner_id'";
  $q=$this->db->query($query);
    if($q -> num_rows() > 0)
     {
         if($type=='success'){
            $query1 = "UPDATE partner_stats SET success_count=success_count+1 WHERE camp_id='$camp_id' AND partner_id='$partner_id'";
          }else if($type=='fail'){
            $query1 = "UPDATE partner_stats SET fail_count=fail_count+1 WHERE camp_id='$camp_id' AND partner_id='$partner_id'";
          }
     }else{
        if($type=='success'){
          $query1 = "INSERT INTO partner_stats (camp_id, partner_id, success_count, fail_count) VALUES ('$camp_id', '$partner_id', '1', '0')";
        }else{
          $query1 = "INSERT INTO partner_stats (camp_id, partner_id, success_count, fail_count) VALUES ('$camp_id', '$partner_id', '0', '1')";
        }
     }
     $q1=$this->db->query($query1);
     if($q1){
      return true;
     }else{
      return false;
     }
}

}
?>