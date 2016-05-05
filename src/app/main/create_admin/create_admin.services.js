(function ()
{
    'use strict';

    angular
        .module('app.create_admin')
        .factory('createAdminService', createAdminService);

    /** @ngInject */
    
    function createAdminService($http, $rootScope)
    {
    return {
      createAdmin: function (obj, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'register/registerAdmin',
				data: 'fullname='+obj.fullname+'&email='+obj.email+'&password='+obj.password,
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