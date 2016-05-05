(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.forgot_password_admin')
        .controller('ForgotPasswordAdminController', ForgotPasswordAdminController);

    /** @ngInject */
    function ForgotPasswordAdminController(ForgotPassAdminService, $scope, $location, $mdToast)
    {
        var vm = this;
        $scope.requestPassword = function(){
            ForgotPassAdminService.requestPassword(vm.form.email, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Password has been sent to your email').position('top right'));
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }

    }
})();