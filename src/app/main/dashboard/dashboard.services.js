(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .factory('DashboardService', DashboardService);

    /** @ngInject */
    
    function DashboardService($http, $rootScope)
    {
    return {
      getUserEvents: function (user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/showUserEvents',
				data: 'user_id='+user_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	addEvent: function (user_id, start_date, end_date, title, description, categories, location, attachments, recurring, recurring_days, start_time, end_time, month_recurring, link, contact_name, contact_number, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/addEvent',
				data: 'user_id='+user_id+'&start_date='+start_date+'&end_date='+end_date+'&title='+title+'&description='+description+'&categories='+categories+'&location='+location+'&attachments='+attachments+'&recurring_type='+recurring+'&recurring_days='+recurring_days+'&start_time='+start_time+'&end_time='+end_time+'&month_recurring='+month_recurring+'&link='+link+'&contact_name='+contact_name+'&contact_number='+contact_number,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	deleteEvent: function (user_id, id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/deleteEvent',
				data: 'user_id='+user_id+'&event_id='+id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	userEditPendingEvent: function (user_id, start_date, end_date, title, description, categories, location, attachments, event_id, recurring, recurring_days, start_time, end_time, month_recurring, link, contact_name, contact_number, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/userEditPendingEvent',
				data: 'user_id='+user_id+'&start_date='+start_date+'&end_date='+end_date+'&title='+title+'&description='+description+'&categories='+categories+'&location='+location+'&event_id='+event_id+'&attachments='+attachments+'&recurring_type='+recurring+'&recurring_days='+recurring_days+'&start_time='+start_time+'&end_time='+end_time+'&month_recurring='+month_recurring+'&link='+link+'&contact_name='+contact_name+'&contact_number='+contact_number,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	userEditApprovedEvent: function (user_id, start_date, end_date, title, description, categories, location, attachments, event_id, recurring, recurring_days, start_time, end_time, month_recurring, link, contact_name, contact_number, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/userEditApprovedEvent',
				data: 'user_id='+user_id+'&start_date='+start_date+'&end_date='+end_date+'&title='+title+'&description='+description+'&categories='+categories+'&location='+location+'&event_id='+event_id+'&status=modified&attachments='+attachments+'&recurring_type='+recurring+'&recurring_days='+recurring_days+'&start_time='+start_time+'&end_time='+end_time+'&month_recurring='+month_recurring+'&link='+link+'&contact_name='+contact_name+'&contact_number='+contact_number,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	uploadFile: function (attachment, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/uploadFile',
				data: attachment,
				transformRequest: angular.identity,
            	headers: {'Content-Type': undefined}
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	notifyAdminEvent: function (event_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/notifyAdminEvent',
				data: 'event_id='+event_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	notifyAdminEventModify: function (event_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/notifyAdminEventModify',
				data: 'event_id='+event_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();