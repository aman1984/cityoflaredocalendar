(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.admin_login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_admin_login', {
            url      : '/auth/admin/login',
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_admin_login': {
                    templateUrl: 'app/main/pages/auth/admin_login/admin_login.html',
                    controller : 'AdminLoginController as vm'
                }
            },
            bodyClass: 'admin_login'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/auth/admin_login');

        // Navigation
        /*msNavigationServiceProvider.saveItem('pages.auth', {
            title : 'Authentication',
            icon  : 'icon-lock',
            weight: 1
        });

        msNavigationServiceProvider.saveItem('pages.auth.login', {
            title : 'Login',
            state : 'app.pages_auth_login',
            weight: 1
        });*/
    }

})();