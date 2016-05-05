(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.reset-password')
        .factory('ResetPassService', ResetPassService);

    /** @ngInject */
    
    function ResetPassService($http, $rootScope)
    {
    return {
      requestPassword: function (password, token, time, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'recoverPassword/resetPassword',
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