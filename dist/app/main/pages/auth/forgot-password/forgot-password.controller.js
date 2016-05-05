(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.forgot-password')
        .controller('ForgotPasswordController', ForgotPasswordController);

    /** @ngInject */
    function ForgotPasswordController(ForgotPassService, $scope, $location, $mdToast)
    {
        var vm = this;
        $scope.requestPassword = function(){
            ForgotPassService.requestPassword(vm.form.email, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Password has been sent to your email!').position('top right'));
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }

    }
})();