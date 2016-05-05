(function ()
{
    'use strict';

    angular
        .module('app.pages.privacy_policy', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_privacy_policy', {
            url      : '/privacy-policy',
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_privacy_policy': {
                    templateUrl: 'app/main/pages/privacy_policy/privacy_policy.html',
                    controller : 'PricavyPolicyController as vm'
                }
            },
            bodyClass: 'privacy_policy'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/privacy_policy');

    }

})();