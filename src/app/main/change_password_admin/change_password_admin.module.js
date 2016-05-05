(function ()
{
    'use strict';

    angular
        .module('app.change_password_admin', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.change_password_admin', {
                url    : '/admin/change_password',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/change_password_admin/change_password_admin.html',
                        controller : 'changePasswordAdminController as vm'
                    }
                }
            });

        /*msNavigationServiceProvider.saveItem('change_password_admin', {
            title    : 'Change password',
            icon     : 'icon-key-variant',
            state    : 'app.change_password_admin',
            weight   : 1
        });*/
    }
})();