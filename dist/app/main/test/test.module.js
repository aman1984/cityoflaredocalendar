(function ()
{
    'use strict';

    angular
        .module('app.test', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.test', {
                url    : '/test',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/test/test.html',
                        controller : 'testController as vm'
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/test');

        // Navigation
        msNavigationServiceProvider.saveItem('fuse', {
            title : 'test',
            group : true,
            weight: 1
        });

        msNavigationServiceProvider.saveItem('fuse.test', {
            title    : 'test',
            icon     : 'icon-tile-four',
            state    : 'app.test',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();