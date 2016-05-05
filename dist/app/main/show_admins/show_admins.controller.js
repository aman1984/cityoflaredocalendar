(function ()
{
    'use strict';

    angular
        .module('app.show_admins')
        .controller('showAdminsController', showAdminsController);

    /** @ngInject */
    function showAdminsController($scope, showAdminsService, $rootScope, $mdDialog, $document, $filter, $mdToast)
    {
        var vm = this;
        showAdminsService.getAllAdmins($rootScope.globals.user_data.user_id, function(data, status){
            console.log(data);
            if(data.success==true){
                vm.userData = data.data;
            }else{
                $mdToast.show($mdToast.simple().textContent('No data found!').position('top right'));
            }
        });

        vm.dtOptions = {
            dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth : false,
            responsive: true
        };

        $scope.editAdmin = function(e, admin_id)
        {
            var start = new Date(),
                end = new Date(),
                obj = {};
                $scope.current_admin_id = admin_id;
                for(var i=0, j=vm.userData.length; i<j; i++){
                    if(vm.userData[i].user_id==admin_id){
                        obj.email = vm.userData[i].email;
                        obj.fullname = vm.userData[i].fullname;
                    }
                }
            showEditFormDialog('edit', true, start, end, e, obj);
        }

        function showEditFormDialog(type, calendarEvent, start, end, e, obj)
        {
            var dialogData = {
                type         : type,
                calendarEvent: calendarEvent,
                start        : start,
                end          : end,
                obj          : obj
            };

            $mdDialog.show({
                controller         : 'AdminEditFormDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/show_admins/dialogs/edit-form/edit-form-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    dialogData: dialogData
                }
            }).then(function (response)
            {   
                console.log(response);
                    showAdminsService.editAdmin($scope.current_admin_id, response.calendarEvent.email, response.calendarEvent.fullname, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Updated!').position('top right'));
                            for(var i=0, j=vm.userData.length; i<j; i++){
                                if(vm.userData[i].user_id==$scope.current_admin_id){
                                    vm.userData[i].fullname = response.calendarEvent.fullname;
                                    vm.userData[i].email = response.calendarEvent.email;
                                    break;
                                }
                            }
                        }
                    });
            });
        }

        $scope.changePassword = function(ev, admin_id) {
            // Appending dialog to document.body to cover sidenav in docs app
            $mdDialog.show({
                controller         : 'AdminChangeAdminPasswordDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/show_admins/dialogs/change_password/change-password-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true
            }).then(function (response){
                showAdminsService.adminChangeAdminPassword(admin_id, response.calendarEvent.password, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Password changed!').position('top right'));
                        }
                    });
            });
        };

        $scope.showConfirm = function(ev, id, email) {
            // Appending dialog to document.body to cover sidenav in docs app
            
            var confirm = $mdDialog.confirm()
                  .title('Are you sure?')
                  .textContent('This admin will be deleted permanentaly.')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              showAdminsService.deleteAdmin(id, email, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Admin deleted!').position('top right'));
                            for(var i=0, j=vm.userData.length; i<j; i++){
                                if(vm.userData[i].admin_id==id){
                                    vm.userData.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    });
            }, function() {
              
            });
          };

       

    }
})();
