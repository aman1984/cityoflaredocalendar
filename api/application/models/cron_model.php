<?php 
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class cron_model extends CI_Model{

function getCampaignAdvancedSettings(){
  $query = "SELECT c.camp_id, c.repost, c.every_hour, c.maximum, c.leads_per, c.last_repost, cp.partners FROM campaigns as c INNER JOIN campaign_partners as cp ON cp.camp_id=c.camp_id WHERE c.status='1' AND c.repost='1'";
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

function getPendingLeads($camp_id, $partner_id){
  $query = "SELECT pl.pending_partners_url, pl.lead_id, rl.form_values, pu.partner_id, pu.url, pu.fields, pl.sr_no FROM pending_leads as pl INNER JOIN registered_leads as rl ON rl.lead_id=pl.lead_id INNER JOIN partner_url  as pu ON pu.url_id=pl.pending_partners_url WHERE rl.camp_id='$camp_id' AND pu.partner_id='$partner_id'";
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

function removePendingLead($sr_no, $lead_id, $partner_id, $url_id, $camp_id, $type){
  $this->db->where('sr_no', $sr_no);
  $this->db->delete('pending_leads');
  $this->forwarLeadSuccess($partner_id, $camp_id, $lead_id, $url_id, $type);
  $this->updateLastRepost($camp_id);
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

function updateLastRepost($camp_id){
    $data['last_repost'] = time();
    $this->db->where('camp_id', $camp_id);
    $this->db->update('campaigns', $data); 
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