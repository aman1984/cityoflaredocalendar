(function ()
{
    'use strict';

    angular
        .module('app.change_password')
        .factory('changeAdminPasswordService', changeAdminPasswordService);

    /** @ngInject */
    
    function changeAdminPasswordService($http, $rootScope)
    {
    return {
    	changeAdminPassword: function (formdata, admin_id, type, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/changeAdminPassword',
				data: 'old_password='+formdata.old_password+'&new_password='+formdata.new_password+'&admin_id='+admin_id+'&type='+type,
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