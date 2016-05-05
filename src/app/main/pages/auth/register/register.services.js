(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.register')
        .factory('RegisterService', RegisterService);

    /** @ngInject */
    
    function RegisterService($http, $rootScope)
    {
    return {
      registerUser: function (formdata, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'register/registerUser',
				data: 'email='+formdata.email+'&password='+formdata.password+'&name='+formdata.name+'&last_name='+formdata.last_name+'&middle_name='+formdata.middle_name+'&title='+formdata.title+'&organization='+formdata.organization+'&phone='+formdata.phone,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	notifyAdminRegister: function (user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/notifyAdminRegister',
				data:'user_id='+user_id,
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