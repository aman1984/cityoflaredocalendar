(function ()
{
    'use strict';

    angular
        .module('app.banner_images')
        .factory('bannerImagesService', bannerImagesService);

    /** @ngInject */
    
    function bannerImagesService($http, $rootScope)
    {
    return {
    	getBannerImage: function (callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/getBannerImages',
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
    	},
    	uploadFile: function (attachment, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/uploadBannerImage',
				data: attachment,
				transformRequest: angular.identity,
            	headers: {'Content-Type': undefined}
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	saveBannerImages: function (images, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/saveBannerImages',
				data: 'images='+images,
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