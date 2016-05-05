(function ()
{
    'use strict';
    angular
        .module('app.pages.auth.login')
        .controller('LoginController', LoginController);
    /** @ngInject */
    function LoginController($scope, LoginService, $rootScope, $state, msNavigationService, $mdToast, $mdDialog)
    {
        var vm = this;
        vm.logging_in = false;
        $rootScope.globals = {};
        $scope.login = function(ev){
            vm.logging_in = true;
            LoginService.Userlogin(vm.form.email, vm.form.password, function(data, status){
                console.log(data);
                vm.logging_in = false;
                if(data.success==true){
                    var responseData = data.data;
                    $rootScope.globals.user_data = responseData;
                    var final_data = JSON.stringify(responseData);
                    try {
                    localStorage.setItem('userData', final_data);
                    }catch(e){
                        console.log(e);
                        $mdDialog.show(
                          $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Browser storage blocked')
                            .textContent('This website needs to store data in your browser. Kindly enable cookies to use this feature.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Got it!')
                            .targetEvent(ev)
                        );
                        return;
                    }
                    $state.go('app.dashboard');
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }
    }
})();