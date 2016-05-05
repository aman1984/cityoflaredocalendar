(function ()
{
    'use strict';

    angular
        .module('app.create_user')
        .controller('createUserController', createUserController);

    /** @ngInject */
    function createUserController($scope, createUserService, $mdToast)
    {
        var vm = this;

        $scope.createAdmin = function($valid){
            console.log(vm.basicForm);
            createUserService.createUser(vm.basicForm, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Created!').position('top right'));
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
