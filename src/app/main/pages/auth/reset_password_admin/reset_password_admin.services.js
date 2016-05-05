(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.reset_password_admin')
        .factory('ResetPassAdminService', ResetPassAdminService);

    /** @ngInject */
    
    function ResetPassAdminService($http, $rootScope)
    {
    return {
      requestPassword: function (password, token, time, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'recoverPassword/resetAdminPassword',
				data: 'password='+password+'&token='+token+'&time='+time,
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