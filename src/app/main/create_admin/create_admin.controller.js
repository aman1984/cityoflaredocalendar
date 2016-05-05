(function ()
{
    'use strict';

    angular
        .module('app.create_admin')
        .controller('createAdminController', createAdminController);

    /** @ngInject */
    function createAdminController($scope, createAdminService, $mdToast)
    {
        var vm = this;

        $scope.createAdmin = function($valid){
            console.log(vm.basicForm);
            createAdminService.createAdmin(vm.basicForm, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Created!').position('top right'));
                    vm.basicForm = {};
                    $scope.basicForm.$setValidity();
                    $scope.basicForm.$setPristine();
                    $scope.basicForm.$setUntouched();
                }else{
                    alert(data.message);
                }
            });
        }
        // Data

        // Methods

        //////////
    }
})();
