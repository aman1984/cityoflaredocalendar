(function ()
{
    'use strict';

    angular
        .module('app.pages.terms_and_condition', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_terms_and_condition', {
            url      : '/terms_and_condition',
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_terms_and_condition': {
                    templateUrl: 'app/main/pages/terms_and_condition/terms_and_condition.html',
                    controller : 'TermsController as vm'
                }
            },
            bodyClass: 'terms_and_condition'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/terms_and_condition');

        // Navigation
        /*msNavigationServiceProvider.saveItem('pages.auth', {
            title : 'Authentication',
            icon  : 'icon-lock',
            weight: 1
        });

        msNavigationServiceProvider.saveItem('pages.auth.landing', {
            title : 'landing',
            state : 'app.pages_auth_landing',
            weight: 1
        });*/
    }

})();