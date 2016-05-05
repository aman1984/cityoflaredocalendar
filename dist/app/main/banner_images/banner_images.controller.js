(function ()
{
    'use strict';

    angular
        .module('app.banner_images')
        .controller('bannerImagesController', bannerImagesController);

    /** @ngInject */
    function bannerImagesController($scope, bannerImagesService, $mdToast, $rootScope)
    {
        var vm = this;
        $scope.addImage = function(){
            document.getElementById('add_image').click();
        }
        vm.attachments = [];
        vm.uploaded_file = [];
        var image_count = 0;
        $scope.uploadingFile = false;
        $scope.deletingFile = false;

        bannerImagesService.getBannerImage(function(data, status){
            console.log(data);
            if(data.success==true){
                var files_attachments = JSON.parse(data.data.images);
                for(var i=0, j=files_attachments.length; i<j; i++){
                    image_count++;
                    var obj = {};
                    var tempObj = {};
                    obj.name = files_attachments[i].name;
                    tempObj.name = files_attachments[i].name;
                    obj.temp_id = image_count;
                    tempObj.size = files_attachments[i].size;
                    obj.size = files_attachments[i].size;
                    obj.filepath = files_attachments[i].filepath;
                    obj.extension = files_attachments[i].extension;
                    tempObj.extension = files_attachments[i].extension;
                    tempObj.filepath = files_attachments[i].filepath;
                    obj.uploading = false;
                    vm.attachments.push(obj);
                    vm.uploaded_file.push(tempObj);
                    console.log(vm.attachments);
                }
            }else{
                $mdToast.show($mdToast.simple().textContent('No data found!').position('top right'));
            }
        });

         $scope.handleFileSelect = function(evt){
            image_count++;
            var files = evt.files; // FileList object
            console.log(files);
            var obj = {};
            obj.name = files[0].name;
            obj.size = Math.ceil(files[0].size/1024);
            obj.uploading = true;
            obj.filepath = '';
            obj.temp_id = image_count;
            vm.attachments.push(obj);

            var formData = new FormData();
            var file = document.getElementById('add_image').files[0];
            formData.append('attachment', file);
            $scope.uploadingFile = true;
            $mdToast.show($mdToast.simple().textContent('Uploading!').position('top right'));
            bannerImagesService.uploadFile(formData, function(data, status){
                console.log(data);
                $scope.uploadingFile = false;
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Uploaded successfully!').position('top right'));
                    var tempObj = {};
                    tempObj.name = files[0].name;
                    tempObj.size = Math.ceil(files[0].size/1024);
                    tempObj.filepath = data.filepath;
                    tempObj.extension = data.extension;
                    vm.uploaded_file.push(tempObj);
                    var uploadData = JSON.stringify(vm.uploaded_file);
                    //vm.uploaded_file.push(data.filepath);
                    for(var i=0, j=vm.attachments.length; i<j; i++){
                        if(vm.attachments[i].temp_id==obj.temp_id){
                            vm.attachments[i].uploading = false;
                            vm.attachments[i].filepath = data.filepath;
                        }
                    }
                    bannerImagesService.saveBannerImages(uploadData, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Banner images list updated!').position('top right'));
                        }else{
                            $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                        }
                    });
                }else{
                    $mdToast.show($mdToast.simple().textContent('Not able to upload!').position('top right'));
                }
            });
          }

          $scope.deleteFile = function(id, filename){
            $scope.deletingFile = true;
            for(var i=0, j=vm.attachments.length; i<j; i++){
                if(vm.attachments[i].temp_id==id){
                    vm.attachments.splice(i, 1);
                    break;
                }
            }
            for(var i=0, j=vm.uploaded_file.length; i<j; i++){
                if(vm.uploaded_file[i].filepath==filename){
                    vm.uploaded_file.splice(i, 1);
                    break;
                }
            }
            var uploadData = JSON.stringify(vm.uploaded_file);
            $mdToast.show($mdToast.simple().textContent('Please wait!').position('top right'));
            bannerImagesService.saveBannerImages(uploadData, function(data, status){
                        console.log(data);
                        $scope.deletingFile = false;
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Image deleted!').position('top right'));
                        }else{
                            $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                        }
            });
            
          }
    }
})();
