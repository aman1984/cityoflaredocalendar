(function ()
{
    'use strict';

    angular
        .module('app.edit_profile_admin')
        .factory('editProfileAdminService', editProfileAdminService);

    /** @ngInject */
    
    function editProfileAdminService($http, $rootScope)
    {
    return {
      getAdminData: function (admin_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/getAdminData',
				data: 'admin_id='+admin_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	editAdminProfile: function (formdata, admin_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/editAdminProfile',
				data: 'email='+formdata.email+'&fullname='+formdata.fullname+'&user_id='+admin_id,
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
				url: $rootScope.Main_Url+'web_services/uploadAdminProfilePic',
				data: attachment,
				transformRequest: angular.identity,
            	headers: {'Content-Type': undefined}
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();