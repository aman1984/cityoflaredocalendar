(function ()
{
    'use strict';

    angular
        .module('app.edit_profile_user')
        .controller('editProfileUserController', editProfileUserController);

    /** @ngInject */
    function editProfileUserController($scope, editProfileUserService, $mdToast, $rootScope)
    {
        var vm = this;
        vm.basicForm = {};
        editProfileUserService.getUserDate($scope.globals.user_data.user_id, function(data, status){
            console.log(data);
            if(data.success==true){
                vm.userData = data.data;
                vm.basicForm.middle_name = data.data.middle_name;
                vm.basicForm.name = data.data.name;
                vm.basicForm.last_name = data.data.last_name;
                vm.basicForm.email = data.data.email;
                vm.basicForm.title = data.data.title;
                vm.basicForm.organization = data.data.organization;
                vm.basicForm.phone = data.data.phone;
                vm.basicForm.profile_pic = data.data.profile_pic;
            }else{
                $mdToast.show($mdToast.simple().textContent('Something is not right!').position('top right'));
            }
        });

        $scope.editUserProfile = function($valid){
            console.log(vm.basicForm);
            editProfileUserService.editUserProfile(vm.basicForm, $rootScope.globals.user_data.user_id, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Updated!').position('top right'));
                    $rootScope.globals.user_data.fullname = vm.basicForm.name+' '+vm.basicForm.last_name;
                    $rootScope.globals.user_data.email = vm.basicForm.email;
                    var final_data = JSON.stringify($rootScope.globals.user_data);
                    localStorage.setItem('userData', final_data);
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }

        $scope.addImage = function(){
            document.getElementById('add_image').click();
        }

        $scope.handleFileSelect = function(evt){
            var files = evt.files; // FileList object
            console.log(files);
            var formData = new FormData();
            var file = document.getElementById('add_image').files[0];
            formData.append('profile_pic', file);
            formData.append('user_id', $rootScope.globals.user_data.user_id);
            $scope.uploadingFile = true;
            $mdToast.show($mdToast.simple().textContent('Uploading!').position('top right'));
            editProfileUserService.uploadFile(formData, function(data, status){
                console.log(data);
                $scope.uploadingFile = false;
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Profile pic changed!').position('top right'));
                    vm.basicForm.profile_pic = data.filepath;
                    $rootScope.globals.user_data.profile_pic = data.filepath;
                    var final_data = JSON.stringify($rootScope.globals.user_data);
                    localStorage.setItem('userData', final_data);
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
          }

    }
})();
