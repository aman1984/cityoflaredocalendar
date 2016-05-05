(function ()
{
    'use strict';

    angular
        .module('app.show_users', ['mdPickers'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.show_users', {
                url    : '/show_users',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/show_users/show_users.html',
                        controller : 'showUsersController as vm'
                    }
                }
            });

        // Translation

        // Navigation
      /*  msNavigationServiceProvider.saveItem('fuse', {
            title : 'show_users',
            group : true,
            weight: 1
        });*/

        msNavigationServiceProvider.saveItem('show_users', {
            title    : 'Show users',
            icon     : 'icon-tile-four',
            state    : 'app.show_users',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();