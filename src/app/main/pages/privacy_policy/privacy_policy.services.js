(function ()
{
    'use strict';

    angular
        .module('app.pages.privacy_policy')
        .factory('PrivacyPolicyService', PrivacyPolicyService);

    /** @ngInject */
    
    function PrivacyPolicyService($http, $rootScope)
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
    	}
    }
	}
})();