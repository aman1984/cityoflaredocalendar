(function ()
{
    'use strict';

    angular
        .module('app.edit_terms')
        .controller('editTermsController', editTermsController);

    /** @ngInject */
    function editTermsController($scope, editTermsService, $mdToast, $rootScope)
    {
        var vm = this;
        vm.basicForm = {};

        editTermsService.getTermsText(function(data, status){
            console.log(data);
            if(data.success==true){
                vm.basicForm.message = data.data;
                
            }else{
                $mdToast.show($mdToast.simple().textContent('Something is not right!').position('top right'));
            }
        });

        $scope.editTerms = function($valid){
            editTermsService.updateTermsText(vm.basicForm, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Terms and condition have been updated').position('top right'));
                    editTermsService.notifyUsersTerms(function(data, status){
                   
                    });
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }
    }
})();
