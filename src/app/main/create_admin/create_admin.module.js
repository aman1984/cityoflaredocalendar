(function ()
{
    'use strict';

    angular
        .module('app.create_admin', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.create_admin', {
                url    : '/create_admin',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/create_admin/create_admin.html',
                        controller : 'createAdminController as vm'
                    }
                }
            });

        // Translation

        // Navigation
        /*msNavigationServiceProvider.saveItem('fuse', {
            title : 'create_admin',
            group : true,
            weight: 1
        });*/

        msNavigationServiceProvider.saveItem('create_admin', {
            title    : 'Create admin',
            icon     : 'icon-tile-four',
            state    : 'app.create_admin',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();