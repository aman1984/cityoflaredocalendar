(function ()
{
    'use strict';

    angular
        .module('app.dashboard_admin')
        .factory('DashboardAdminService', DashboardAdminService);

    /** @ngInject */
    
    function DashboardAdminService($http, $rootScope)
    {
    return {
      getAllEvents: function (user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/showAllEvents',
				data: 'user_id='+user_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	addEventAdmin: function (admin_id, start_date, end_date, title, description, categories, location, attachments, recurring, recurring_days, start_time, end_time, month_recurring, link, contact_name, contact_number, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/addEventAdmin',
				data: 'user_id='+admin_id+'&start_date='+start_date+'&end_date='+end_date+'&title='+title+'&description='+description+'&categories='+categories+'&location='+location+'&attachments='+attachments+'&recurring_type='+recurring+'&recurring_days='+recurring_days+'&start_time='+start_time+'&end_time='+end_time+'&month_recurring='+month_recurring+'&link='+link+'&contact_name='+contact_name+'&contact_number='+contact_number,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	approveEvent: function (id, event_status, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/approveEvent',
				data: 'event_id='+id+'&status='+event_status,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	declineEvent: function (id,event_status, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/declineEvent',
				data: 'event_id='+id+'&status='+event_status,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	deleteEvent: function (id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/deleteEvent',
				data: 'event_id='+id,
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
    	adminEditEvent: function (start_date, end_date, title, description, categories, location, attachments, event_id, recurring, recurring_days, start_time, end_time, month_recurring, link, contact_name, contact_number, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/adminEditEvent',
				data: 'start_date='+start_date+'&end_date='+end_date+'&title='+title+'&description='+description+'&categories='+categories+'&location='+location+'&event_id='+event_id+'&attachments='+attachments+'&recurring_type='+recurring+'&recurring_days='+recurring_days+'&start_time='+start_time+'&end_time='+end_time+'&month_recurring='+month_recurring+'&link='+link+'&contact_name='+contact_name+'&contact_number='+contact_number,
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