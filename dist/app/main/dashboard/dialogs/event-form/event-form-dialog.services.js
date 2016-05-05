(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .factory('DashboardEventEditService', DashboardEventEditService);

    /** @ngInject */
    
    function DashboardEventEditService($http, $rootScope)
    {
    return {
      getEventsAttachments: function (event_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/showEventAttachments',
				data: 'event_id='+event_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	deleteEvent: function (user_id, id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/deleteEvent',
				data: 'user_id='+user_id+'&event_id='+id,
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