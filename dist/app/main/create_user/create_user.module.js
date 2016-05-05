(function ()
{
    'use strict';

    angular
        .module('app.create_user', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.create_user', {
                url    : '/create_user',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/create_user/create_user.html',
                        controller : 'createUserController as vm'
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

        msNavigationServiceProvider.saveItem('create_user', {
            title    : 'Create User',
            icon     : 'icon-tile-four',
            state    : 'app.create_user',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();