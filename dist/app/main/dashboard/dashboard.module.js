(function ()
{
    'use strict';

    angular
        .module('app.dashboard', ['mdPickers'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.dashboard', {
                url    : '/dashboard',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/dashboard/dashboard.html',
                        controller : 'dashboardController as vm'
                    }
                }
            });

        // Translation

        // Navigation
        /*msNavigationServiceProvider.saveItem('fuse', {
            title : 'dashboard',
            group : true,
            weight: 1
        });*/

        msNavigationServiceProvider.saveItem('dashboard', {
            title    : 'Dashboard',
            icon     : 'icon-tile-four',
            state    : 'app.dashboard',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();