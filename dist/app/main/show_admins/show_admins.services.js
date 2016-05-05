(function ()
{
    'use strict';

    angular
        .module('app.show_admins')
        .factory('showAdminsService', showAdminsService);

    /** @ngInject */
    
    function showAdminsService($http, $rootScope)
    {
    return {
      getAllAdmins: function (user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/showAllAdmins',
				data: 'user_id='+user_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	deleteAdmin	: function (user_id, email, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/deleteAdmin',
				data: 'user_id='+user_id+'&email='+email,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	editAdmin	: function (user_id, email, fullname, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/editAdmin',
				data: 'user_id='+user_id+'&email='+email+'&fullname='+fullname,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	adminChangeAdminPassword: function (user_id, password, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/adminChangeAdminPassword',
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