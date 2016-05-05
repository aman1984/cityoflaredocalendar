(function ()
{
    'use strict';

    angular
        .module('app.user.dashboard', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.user_dashboard', {
            url      : '/dashboard',
            views    : {
                'content@app.user_dashboard': {
                    templateUrl: 'app/main/user/dashboard/dashboard.html',
                    controller : 'DashboardController as vm'
                }
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('user.dashboard', {
            title : 'Dashboard',
            icon  : 'icon-tile-four',
            weight: 1,
            state    : 'app.user_dashboard'
        });
    }

})();