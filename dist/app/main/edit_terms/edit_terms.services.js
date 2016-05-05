(function ()
{
    'use strict';

    angular
        .module('app.edit_terms')
        .factory('editTermsService', editTermsService);

    /** @ngInject */
    
    function editTermsService($http, $rootScope)
    {
    return {
    	getTermsText: function (callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/getTermsText',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	updateTermsText: function (formdata, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/updateTermsText',
				data: 'text='+encodeURIComponent(formdata.message),
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	notifyUsersTerms: function (callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/notifyUsersTerms',
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