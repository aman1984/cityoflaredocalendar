(function ()
{
    'use strict';

    angular
        .module('app.change_password')
        .factory('changeUserPasswordService', changeUserPasswordService);

    /** @ngInject */
    
    function changeUserPasswordService($http, $rootScope)
    {
    return {
    	changeUserPassword: function (formdata, user_id, type, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/changeUserPassword',
				data: 'old_password='+formdata.old_password+'&new_password='+formdata.new_password+'&user_id='+user_id+'&type='+type,
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