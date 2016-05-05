(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.master_login')
        .factory('MasterLoginService', MasterLoginService);

    /** @ngInject */
    
    function MasterLoginService($http, $rootScope)
    {
    return {
      Masterlogin: function (email, password, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/loginAdmin',
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