(function ()
{
    'use strict';

    angular
        .module('app.edit_privacy_policy')
        .controller('editPrivacyPolicyController', editPrivacyPolicyController);

    /** @ngInject */
    function editPrivacyPolicyController($scope, editPrivacyPolicyService, $mdToast, $rootScope)
    {
        var vm = this;
        vm.basicForm = {};

        editPrivacyPolicyService.getPrivacyPolicyText(function(data, status){
            console.log(data);
            if(data.success==true){
                vm.basicForm.message = data.data;
                
            }else{
                $mdToast.show($mdToast.simple().textContent('Something is not right!').position('top right'));
            }
        });

        $scope.editText = function($valid){
            editPrivacyPolicyService.updatePrivacyText(vm.basicForm, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Privacy Policy have been updated').position('top right'));
                    /*editPrivacyPolicyService.notifyUsersTerms(function(data, status){
                   
                    });*/
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }
    }
})();
