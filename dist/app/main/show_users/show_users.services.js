(function ()
{
    'use strict';

    angular
        .module('app.show_users')
        .factory('showUsersService', showUsersService);

    /** @ngInject */
    
    function showUsersService($http, $rootScope)
    {
    return {
      getAllUsers: function (user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/showAllUsers',
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
    	deleteUser: function (user_id, email, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/deleteUser',
				data: 'user_id='+user_id+'&email='+email,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	activateUser: function (user_id, email, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/activateUser',
				data: 'user_id='+user_id+'&email='+email,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	deactivateUser: function (user_id, email, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/deactivateUser',
				data: 'user_id='+user_id+'&email='+email,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	editUser: function (user_id, email, name, last_name, middle_name, organization, title, phone, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/editUser',
				data: 'user_id='+user_id+'&email='+email+'&name='+name+'&last_name='+last_name+'&middle_name='+middle_name+'&organization='+organization+'&title='+title+'&phone='+phone,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	adminChangeUserPassword: function (user_id, password, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/adminChangeUserPassword',
				data: 'user_id='+user_id+'&password='+password,
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