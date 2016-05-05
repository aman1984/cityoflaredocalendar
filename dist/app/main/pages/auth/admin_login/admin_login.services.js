(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.admin_login')
        .factory('AdminLoginService', AdminLoginService);

    /** @ngInject */
    
    function AdminLoginService($http, $rootScope)
    {
    return {
      subAdminlogin: function (email, password, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/loginSubAdmin',
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