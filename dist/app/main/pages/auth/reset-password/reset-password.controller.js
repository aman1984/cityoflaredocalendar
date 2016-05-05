(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.reset-password')
        .controller('ResetPasswordController', ResetPasswordController);

    /** @ngInject */
    function ResetPasswordController($scope, ResetPassService, $location, $state, $mdToast)
    {
        var vm = this;
        var token = $location.search().id;
        var time = $location.search().v;
        $scope.resetPassword = function(){
            if(token!==undefined){
            ResetPassService.requestPassword(vm.form.password, token,time, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Password is changed!').position('top right'));
                    $state.go('app.pages_auth_login');
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }else{
            $mdToast.show($mdToast.simple().textContent('Cant change password. Please follow the link in your email!').position('top right'));
        }
            //alert($location.absUrl());
        }
    }
})();