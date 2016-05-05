(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.reset_password_master')
        .factory('ResetPassMasterService', ResetPassMasterService);

    /** @ngInject */
    
    function ResetPassMasterService($http, $rootScope)
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