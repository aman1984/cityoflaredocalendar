(function ()
{
    'use strict';

    angular
        .module('app.create_user')
        .factory('createUserService', createUserService);

    /** @ngInject */
    
    function createUserService($http, $rootScope)
    {
    return {
      createUser: function (formdata, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'register/createUser',
				data: 'email='+formdata.email+'&password='+formdata.password+'&name='+formdata.name+'&last_name='+formdata.last_name+'&middle_name='+formdata.middle_name+'&title='+formdata.title+'&organization='+formdata.organization+'&phone='+formdata.phone+'&account_status=active',
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