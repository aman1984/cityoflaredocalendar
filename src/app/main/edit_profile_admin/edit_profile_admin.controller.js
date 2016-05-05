(function ()
{
    'use strict';

    angular
        .module('app.edit_profile_admin')
        .controller('editProfileAdminController', editProfileAdminController);

    /** @ngInject */
    function editProfileAdminController($scope, editProfileAdminService, $mdToast, $rootScope)
    {
        var vm = this;
        vm.basicForm = {};
        editProfileAdminService.getAdminData($scope.globals.user_data.admin_id, function(data, status){
            console.log(data);
            if(data.success==true){
                vm.userData = data.data;
                vm.basicForm.email = data.data.email;
                vm.basicForm.fullname = data.data.fullname;
                vm.basicForm.profile_pic = data.data.profile_pic;
            }else{
                $mdToast.show($mdToast.simple().textContent('Something is not right!').position('top right'));
            }
        });

        $scope.editAdminProfile = function($valid){
            console.log(vm.basicForm);
            editProfileAdminService.editAdminProfile(vm.basicForm, $rootScope.globals.user_data.admin_id, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Updated!').position('top right'));
                    $rootScope.globals.user_data.fullname = vm.basicForm.fullname;
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
            formData.append('admin_id', $rootScope.globals.user_data.admin_id);
            $scope.uploadingFile = true;
            $mdToast.show($mdToast.simple().textContent('Uploading!').position('top right'));
            editProfileAdminService.uploadFile(formData, function(data, status){
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
