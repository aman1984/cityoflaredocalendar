(function ()
{
    'use strict';

    angular
        .module('fuse')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state, msNavigationService)
    {
        $rootScope.Main_Url = 'http://localhost/events_calendar/api/';
        //$rootScope.Main_Url = 'http://www.cityoflaredocalendar.com/angular/api/';
        var guest_restricted_states = ['app.dashboard_admin', 'app.create_admin', 'app.create_user', 'app.show_admins', 'app.show_users', 'app.dashboard', 'app.edit_profile_user', 'app.change_password', 'app.change_password_admin', 'app.edit_terms', 'app.edit_privacy_policy', 'app.banner_images']; 
        var user_restricted_states = ['app.dashboard_admin', 'app.create_admin', 'app.create_user', 'app.show_admins', 'app.show_users', 'app.change_password_admin', 'app.edit_terms', 'app.edit_privacy_policy', 'app.banner_images']; 
        var admin_restricted_states = ['app.dashboard', 'app.edit_profile_user', 'app.create_admin', 'app.show_admins', 'app.change_password', 'app.banner_images']; 
        var master_restricted_states = ['app.dashboard', 'app.edit_profile_user', 'app.change_password']; 
        var login_states = ['app.pages_auth_login', 'app.pages_auth_master_login', 'app.pages_auth_admin_login']; 
        var user_dashboard = 'app.dashboard';
        var admin_dashboard = 'app.dashboard_admin';
        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams)
        {
            console.log('redirecting');
            $rootScope.loadingProgress = true;

            if($rootScope.globals===undefined){
                var $cookies;

                    angular.injector(['ngCookies']).invoke([
                        '$cookies', function (_$cookies)
                        {
                            $cookies = _$cookies;
                        }
                    ]);

                $rootScope.globals = {};
                $rootScope.globals.user_data = JSON.parse(localStorage.getItem('userData')) || {};
                //$rootScope.globals.user_data = JSON.parse( $cookies.get('userData')) || {};
                if($rootScope.globals.user_data.type!==undefined){
                    if(user_restricted_states.indexOf(toState.name)>-1 && $rootScope.globals.user_data.type=='user') {
                        console.log('user not allowed');
                        event.preventDefault();
                        $state.go('app.pages_calendar');
                    }else if(admin_restricted_states.indexOf(toState.name)>-1 && $rootScope.globals.user_data.type=='sub') {
                        console.log('user not allowed');
                        event.preventDefault();
                        $state.go('app.pages_calendar');
                    }else if(master_restricted_states.indexOf(toState.name)>-1 && $rootScope.globals.user_data.type=='master') {
                        console.log('user not allowed');
                        event.preventDefault();
                        $state.go('app.pages_calendar');
                    }
                    if(login_states.indexOf(toState.name)>-1){

                        if($rootScope.globals.user_data.type=='user'){
                            event.preventDefault();
                            $state.go(user_dashboard);
                        }else if($rootScope.globals.user_data.type=='sub' || $rootScope.globals.user_data.type=='master'){
                            event.preventDefault();

                            $state.go(admin_dashboard);
                        }
                    }
                    hideNavigations(toState);
                }else{
                    if(guest_restricted_states.indexOf(toState.name)>-1) {
                        console.log('user not allowed');
                        event.preventDefault();
                        $state.go('app.pages_calendar');
                    }
                }
            }else if($rootScope.globals.user_data!==undefined){
                if(user_restricted_states.indexOf(toState.name)>-1 && $rootScope.globals.user_data.type=='user') {
                        console.log('user not allowed');
                        event.preventDefault();
                        $state.go('app.pages_calendar');
                    }else if(admin_restricted_states.indexOf(toState.name)>-1 && $rootScope.globals.user_data.type=='sub') {
                        console.log('user not allowed');
                        event.preventDefault();
                        $state.go('app.pages_calendar');
                    }else if(master_restricted_states.indexOf(toState.name)>-1 && $rootScope.globals.user_data.type=='master') {
                        console.log('user not allowed');
                        event.preventDefault();
                        $state.go('app.pages_calendar');
                    }
                    if(login_states.indexOf(toState.name)>-1){

                        if($rootScope.globals.user_data.type=='user'){
                            event.preventDefault();
                            $state.go(user_dashboard);
                        }else if($rootScope.globals.user_data.type=='sub' || $rootScope.globals.user_data.type=='master'){
                            event.preventDefault();

                            $state.go(admin_dashboard);
                        }
                    }
                hideNavigations(toState);
            }
        });

        function checkRestrictions(){

        }

        function hideNavigations(toState){
            if($rootScope.globals.user_data.type=='user'){
                msNavigationService.deleteItem('create_admin');
                msNavigationService.deleteItem('create_user');
                msNavigationService.deleteItem('dashboard_admin');
                msNavigationService.deleteItem('show_admins');
                msNavigationService.deleteItem('show_users');
                msNavigationService.deleteItem('change_password_admin');
                msNavigationService.deleteItem('edit_terms');
                msNavigationService.deleteItem('edit_privacy_policy');
                msNavigationService.deleteItem('banner_images');
            }else if($rootScope.globals.user_data.type=='sub'){
                if(admin_restricted_states.indexOf(toState.name)>-1) {
                    console.log('admin not allowed');
                    $state.go('app.pages_calendar');
                }
                msNavigationService.deleteItem('create_admin');
                msNavigationService.deleteItem('show_admins');
                msNavigationService.deleteItem('dashboard');
                msNavigationService.deleteItem('banner_images');
            }else if($rootScope.globals.user_data.type=='master'){
                if(master_restricted_states.indexOf(toState.name)>-1) {
                    console.log('master not allowed');
                    $state.go('app.pages_calendar');
                }
                msNavigationService.deleteItem('dashboard');
            }
        }

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
        {
            $timeout(function ()
            {
                $rootScope.loadingProgress = false;
            });
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function ()
        {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        })
    }
})();