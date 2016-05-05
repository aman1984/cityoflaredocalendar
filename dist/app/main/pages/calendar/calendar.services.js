(function ()
{
    'use strict';

    angular
        .module('app.pages.calendar')
        .factory('CalendarService', CalendarService);

    /** @ngInject */
    
    function CalendarService($http, $rootScope)
    {
    return {
      showApprovedEvents: function (user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/showApprovedEvents',
				data: 'user_id='+user_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	searchApprovedEvents: function (category, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/searchApprovedEvents',
				data: 'category='+category,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	textSearchApprovedEvents: function (keyword, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/textSearchApprovedEvents',
				data: 'keyword='+keyword,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	getBannerImages: function (callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/getBannerImages',
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