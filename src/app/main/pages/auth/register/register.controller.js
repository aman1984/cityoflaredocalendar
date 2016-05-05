(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.register')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController(RegisterService, $scope, $state, $mdToast)
    {
        var vm = this;
        $scope.register = function(){
            RegisterService.registerUser(vm.form, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));

                    RegisterService.notifyAdminRegister(data.user_id, function(data, status){
                        
                    });

                    $state.go('app.pages_auth_login');
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }

    }
})();