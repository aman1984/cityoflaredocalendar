(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.forgot_password_master', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_forgot_password_master', {
            url      : '/auth/forgot-password-master',
            views    : {
                'main@'                                 : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_forgot_password_master': {
                    templateUrl: 'app/main/pages/auth/forgot_password_master/forgot_password_master.html',
                    controller : 'ForgotPasswordMasterController as vm'
                }
            },
            bodyClass: 'forgot_password_master'
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