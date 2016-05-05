(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.master_login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_master_login', {
            url      : '/auth/master/login',
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_master_login': {
                    templateUrl: 'app/main/pages/auth/master_login/master_login.html',
                    controller : 'MasterLoginController as vm'
                }
            },
            bodyClass: 'master_login'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/auth/master_login');

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