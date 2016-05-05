(function ()
{
    'use strict';

    angular
        .module('app.change_password')
        .controller('changePasswordController', changePasswordController);

    /** @ngInject */
    function changePasswordController($scope, changeUserPasswordService, $mdToast, $rootScope)
    {
        var vm = this;
        vm.basicForm = {};
        

        $scope.changePassword = function($valid){
            changeUserPasswordService.changeUserPassword(vm.basicForm, $rootScope.globals.user_data.user_id, $rootScope.globals.user_data.type, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Password has been changed!').position('top right'));
                    vm.basicForm = {};
                    $scope.basicForm.$setValidity();
                    $scope.basicForm.$setPristine();
                    $scope.basicForm.$setUntouched();
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }
    }
})();
