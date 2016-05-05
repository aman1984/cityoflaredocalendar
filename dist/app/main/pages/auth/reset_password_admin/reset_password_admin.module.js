(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.reset_password_admin', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_reset_password_admin', {
            url      : '/auth/reset-password-admin',
            views    : {
                'main@'                                : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_reset_password_admin': {
                    templateUrl: 'app/main/pages/auth/reset_password_admin/reset_password_admin.html',
                    controller : 'ResetPasswordAdminController as vm'
                }
            },
            bodyClass: 'reset_password_admin'
        });

        // Translation

        // Navigation
        /*msNavigationServiceProvider.saveItem('pages.auth.reset-password', {
            title : 'Reset Password',
            state : 'app.pages_auth_reset-password',
            weight: 6
        });*/
    }

})();