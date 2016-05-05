(function ()
{
    'use strict';

    angular
        .module('app.edit_privacy_policy')
        .factory('editPrivacyPolicyService', editPrivacyPolicyService);

    /** @ngInject */
    
    function editPrivacyPolicyService($http, $rootScope)
    {
    return {
    	getPrivacyPolicyText: function (callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/getPrivacyPolicyText',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	updatePrivacyText: function (formdata, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/updatePrivacyText',
				data: 'text='+encodeURIComponent(formdata.message),
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	notifyUsersPrivacy: function (callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/notifyUsersPrivacy',
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