(function ()
{
    'use strict';

    angular
        .module('app.pages', [
            'app.pages.auth.login',
            'app.pages.auth.admin_login',
            'app.pages.auth.master_login',
            'app.pages.auth.register',
            'app.pages.auth.forgot-password',
            'app.pages.auth.forgot_password_admin',
            'app.pages.auth.forgot_password_master',
            'app.pages.auth.reset-password',
            'app.pages.auth.reset_password_admin',
            'app.pages.auth.reset_password_master',
            'app.pages.terms_and_condition',
            'app.pages.privacy_policy',
            'app.pages.calendar'
        ])
      //  .config(config);

    /** @ngInject */
    /*function config(msNavigationServiceProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('pages', {
            title : 'PAGES',
            group : true,
            weight: 2
        });
    }*/
})();