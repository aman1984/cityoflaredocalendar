(function ()
{
    'use strict';

    angular
        .module('app.edit_terms', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.edit_terms', {
                url    : '/edit_terms',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/edit_terms/edit_terms.html',
                        controller : 'editTermsController as vm'
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

        msNavigationServiceProvider.saveItem('edit_terms', {
            title    : 'Edit terms',
            icon     : 'icon-keyboard-variant',
            state    : 'app.edit_terms',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();