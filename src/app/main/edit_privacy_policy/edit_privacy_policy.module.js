(function ()
{
    'use strict';

    angular
        .module('app.edit_privacy_policy', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.edit_privacy_policy', {
                url    : '/edit_privacy_policy',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/edit_privacy_policy/edit_privacy_policy.html',
                        controller : 'editPrivacyPolicyController as vm'
                    }
                }
            });

        // Translation

        // Navigation
       /* msNavigationServiceProvider.saveItem('fuse', {
            title : 'create_user',
            group : true,
            weight: 1
        });*/

        msNavigationServiceProvider.saveItem('edit_privacy_policy', {
            title    : 'Edit Privacy',
            icon     : 'icon-keyboard-variant',
            state    : 'app.edit_privacy_policy',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();