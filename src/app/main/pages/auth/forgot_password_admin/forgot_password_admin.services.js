(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.forgot_password_admin')
        .factory('ForgotPassAdminService', ForgotPassAdminService);

    /** @ngInject */
    
    function ForgotPassAdminService($http, $rootScope)
    {
    return {
      requestPassword: function (email, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'forgotPassword/adminRequestPassword',
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