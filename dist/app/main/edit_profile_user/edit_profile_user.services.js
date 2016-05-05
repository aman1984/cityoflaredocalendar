(function ()
{
    'use strict';

    angular
        .module('app.edit_profile_user')
        .factory('editProfileUserService', editProfileUserService);

    /** @ngInject */
    
    function editProfileUserService($http, $rootScope)
    {
    return {
      getUserDate: function (user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/getUserDate',
				data: 'user_id='+user_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	editUserProfile: function (formdata, user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/editUserProfile',
				data: 'email='+formdata.email+'&name='+formdata.name+'&last_name='+formdata.last_name+'&middle_name='+formdata.middle_name+'&title='+formdata.title+'&organization='+formdata.organization+'&phone='+formdata.phone+'&user_id='+user_id,
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
				url: $rootScope.Main_Url+'web_services/uploadUserProfilePic',
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