(function ()
{
    'use strict';

    angular
        .module('app.user', [
            'app.user.dashboard'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('user', {
            title : 'DASHBOARD',
            group : true,
            weight: 2
        });
    }
})();