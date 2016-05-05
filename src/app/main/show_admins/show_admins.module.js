(function ()
{
    'use strict';

    angular
        .module('app.show_admins', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.show_admins', {
                url    : '/show_admins',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/show_admins/show_admins.html',
                        controller : 'showAdminsController as vm'
                    }
                }
            });

        // Translation

        // Navigation
        /*msNavigationServiceProvider.saveItem('fuse', {
            title : 'show_admins',
            group : true,
            weight: 1
        });*/
        msNavigationServiceProvider.saveItem('show_admins', {
            title    : 'Show admins',
            icon     : 'icon-tile-four',
            state    : 'app.show_admins',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();