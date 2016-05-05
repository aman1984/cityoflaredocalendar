(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.login')
        .factory('LoginService', LoginService);

    /** @ngInject */
    
    function LoginService($http, $rootScope)
    {
    return {
      Userlogin: function (email, password, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/loginUser',
				data: 'email='+email+'&password='+password,
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