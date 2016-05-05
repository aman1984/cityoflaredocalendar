(function ()
{
    'use strict';

    angular
        .module('app.change_password', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.change_password', {
                url    : '/user/change_password',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/change_password/change_password.html',
                        controller : 'changePasswordController as vm'
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

        /*msNavigationServiceProvider.saveItem('change_password', {
            title    : 'Change password',
            icon     : 'icon-key-variant',
            state    : 'app.change_password',
            weight   : 1
        });*/
    }
})();