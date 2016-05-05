(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.forgot_password_master')
        .factory('ForgotPassMasterService', ForgotPassMasterService);

    /** @ngInject */
    
    function ForgotPassMasterService($http, $rootScope)
    {
    return {
      masterRequestPassword: function (email, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'forgotPassword/masterRequestPassword',
				data: 'email='+email,
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