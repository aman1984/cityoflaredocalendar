(function ()
{
    'use strict';

    angular
        .module('app.dashboard_admin', ['slick', 'mdPickers'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.dashboard_admin', {
                url    : '/dashboard_admin',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/dashboard_admin/dashboard_admin.html',
                        controller : 'dashboard_adminController as vm'
                    }
                }
            });

        // Translation

        // Navigation
        /*msNavigationServiceProvider.saveItem('fuse', {
            title : 'dashboard_admin',
            group : true,
            weight: 1
        });*/

        msNavigationServiceProvider.saveItem('dashboard_admin', {
            title    : 'Dashboard',
            icon     : 'icon-tile-four',
            state    : 'app.dashboard_admin',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();