(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.reset_password_master', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_reset_password_master', {
            url      : '/auth/reset-password-master',
            views    : {
                'main@'                                : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_reset_password_master': {
                    templateUrl: 'app/main/pages/auth/reset_password_master/reset_password_master.html',
                    controller : 'ResetPasswordMasterController as vm'
                }
            },
            bodyClass: 'reset_password_master'
        });
    }

})();