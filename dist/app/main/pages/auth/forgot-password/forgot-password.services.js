(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.forgot-password')
        .factory('ForgotPassService', ForgotPassService);

    /** @ngInject */
    
    function ForgotPassService($http, $rootScope)
    {
    return {
      requestPassword: function (email, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'forgotPassword/sendMail',
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