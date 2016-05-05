(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.forgot_password_admin', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_forgot_password_admin', {
            url      : '/auth/forgot-password-admin',
            views    : {
                'main@'                                 : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_forgot_password_admin': {
                    templateUrl: 'app/main/pages/auth/forgot_password_admin/forgot_password_admin.html',
                    controller : 'ForgotPasswordAdminController as vm'
                }
            },
            bodyClass: 'forgot_password_admin'
        });

        // Translation

        // Navigation
        /*msNavigationServiceProvider.saveItem('pages.auth.forgot-password', {
            title : 'Forgot Password',
            state : 'app.pages_auth_forgot-password',
            weight: 5
        });*/
    }

})();