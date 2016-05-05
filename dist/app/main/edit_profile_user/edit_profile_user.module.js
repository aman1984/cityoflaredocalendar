(function ()
{
    'use strict';

    angular
        .module('app.edit_profile_user', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.edit_profile_user', {
                url    : '/user/edit_profile',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/edit_profile_user/edit_profile_user.html',
                        controller : 'editProfileUserController as vm'
                    }
                }
            });


        /*msNavigationServiceProvider.saveItem('edit_profile_user', {
            title    : 'Edit profile',
            icon     : 'icon-border-color',
            state    : 'app.edit_profile_user',
            weight   : 1
        });*/
    }
})();