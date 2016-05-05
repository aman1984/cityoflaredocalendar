(function ()
{
    'use strict';

    angular
        .module('app.banner_images', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.banner_images', {
                url    : '/banner_images',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/banner_images/banner_images.html',
                        controller : 'bannerImagesController as vm'
                    }
                }
            });

        // Translation

        // Navigation
       /* msNavigationServiceProvider.saveItem('fuse', {
            title : 'create_user',
            group : true,
            weight: 1
        });*/

        msNavigationServiceProvider.saveItem('banner_images', {
            title    : 'Banner images',
            icon     : 'icon-image-area',
            state    : 'app.banner_images',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();