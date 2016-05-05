(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.reset_password_master')
        .controller('ResetPasswordMasterController', ResetPasswordMasterController);

    /** @ngInject */
    function ResetPasswordMasterController($scope, ResetPassMasterService, $location, $state)
    {
        var vm = this;
        var token = $location.search().id;
        var time = $location.search().v;
        $scope.resetPassword = function(){
            if(token!==undefined){
            ResetPassMasterService.requestPassword(vm.form.password, token, time, function(data, status){
                console.log(data);
                if(data.success==true){
                    alert('Password is changed');
                    $state.go('app.pages_auth_master_login');
                }else{
                    alert(data.message);
                }
            });
        }else{
            alert('Cant change password. Please follow the link in your email.');
        }
            //alert($location.absUrl());
        }
    }
})();