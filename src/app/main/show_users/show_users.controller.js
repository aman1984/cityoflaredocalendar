(function ()
{
    'use strict';

    angular
        .module('app.show_users')
        .controller('showUsersController', showUsersController);

    /** @ngInject */
    function showUsersController($scope, showUsersService, $rootScope, $mdDialog, $document, $filter, $mdToast)
    {
        var vm = this;
        $scope.current_user_id = '';
        showUsersService.getAllUsers($rootScope.globals.user_data.user_id, function(data, status){
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

        $scope.addEvent = function(e, user_id)
        {
            var start = new Date(),
                end = new Date(),
                obj = {};
                $scope.current_user_id = user_id;
            showEventFormDialog('add', false, start, end, e, obj);
        }

        function showEventFormDialog(type, calendarEvent, start, end, e, obj)
        {
            var dialogData = {
                type         : type,
                calendarEvent: calendarEvent,
                start        : start,
                end          : end,
                obj          : obj
            };

            $mdDialog.show({
                controller         : 'EventFormDialogShowUserController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/show_users/dialogs/event-form/event-form-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: false,
                locals             : {
                    dialogData: dialogData
                }
            }).then(function (response)
            {
                if ( response.type === 'add' )
                {
                    console.log(response.calendarEvent);
                //    $scope.currentYear = $filter('date')($scope.currentDate, "yyyy");
                    // Add new
                    if($scope.current_user_id!==''){
                    var start_date = $filter('date')(response.calendarEvent.start, "yyyy-MM-dd");
                    var end_date = $filter('date')(response.calendarEvent.end, "yyyy-MM-dd");
                    showUsersService.addEvent($scope.current_user_id, start_date, end_date, response.calendarEvent.title, response.calendarEvent.description, response.calendarEvent.categories, response.calendarEvent.location, JSON.stringify(response.calendarEvent.attachments), response.calendarEvent.recurring, response.calendarEvent.recurring_days, response.calendarEvent.start_time_hours+':'+response.calendarEvent.start_time_minutes, response.calendarEvent.end_time_hours+':'+response.calendarEvent.end_time_minutes, response.calendarEvent.month_recurring, response.calendarEvent.link, response.calendarEvent.contact_name, response.calendarEvent.contact_number, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $scope.current_user_id = '';
                            $mdToast.show($mdToast.simple().textContent('Event Created!').position('top right'));

                        }
                    });
                    }
                }
                else
                {
                    console.log(response);
                    
                }
            });
        }

         $scope.editUser = function(e, user_id)
        {
            var start = new Date(),
                end = new Date(),
                obj = {};
                $scope.current_user_id = user_id;
                for(var i=0, j=vm.userData.length; i<j; i++){
                    if(vm.userData[i].user_id==user_id){
                        obj.email = vm.userData[i].email;
                        obj.name = vm.userData[i].name;
                        obj.last_name = vm.userData[i].last_name;
                        obj.middle_name = vm.userData[i].middle_name;
                        obj.organization = vm.userData[i].organization;
                        obj.phone = vm.userData[i].phone;
                        obj.title = vm.userData[i].title;
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
                controller         : 'UserEditFormDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/show_users/dialogs/edit-form/edit-form-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: false,
                locals             : {
                    dialogData: dialogData
                }
            }).then(function (response)
            {   
                console.log(response);
                    showUsersService.editUser($scope.current_user_id, response.calendarEvent.email, response.calendarEvent.name, response.calendarEvent.last_name, response.calendarEvent.middle_name, response.calendarEvent.organization, response.calendarEvent.title, response.calendarEvent.phone, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Updated!').position('top right'));
                            for(var i=0, j=vm.userData.length; i<j; i++){
                                if(vm.userData[i].user_id==$scope.current_user_id){
                                    vm.userData[i].name = response.calendarEvent.name;
                                    vm.userData[i].last_name = response.calendarEvent.last_name;
                                    vm.userData[i].middle_name = response.calendarEvent.middle_name;
                                    vm.userData[i].organization = response.calendarEvent.organization;
                                    vm.userData[i].title = response.calendarEvent.title;
                                    vm.userData[i].phone = response.calendarEvent.phone;
                                    vm.userData[i].email = response.calendarEvent.email;
                                    console.log(vm.userData);
                                    break;
                                }
                            }
                        }
                    });
            });
        }

        $scope.changePassword = function(ev, user_id) {
            // Appending dialog to document.body to cover sidenav in docs app
            $mdDialog.show({
                controller         : 'UserChangePasswordDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/show_users/dialogs/change_password/change-password-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true
            }).then(function (response){
                console.log(response);
                showUsersService.adminChangeUserPassword(user_id, response.calendarEvent.password, function(data, status){
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
                  .textContent('This user will be deleted permanentaly.')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              showUsersService.deleteUser(id, email, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('User deleted!').position('top right'));
                            for(var i=0, j=vm.userData.length; i<j; i++){
                                if(vm.userData[i].user_id==id){
                                    vm.userData.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    });
            }, function() {
              
            });
          };

          $scope.activateUser = function(user_id, email){
            showUsersService.activateUser(user_id, email, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('User activated!').position('top right'));
                            for(var i=0, j=vm.userData.length; i<j; i++){
                                if(vm.userData[i].user_id==user_id){
                                    vm.userData[i].account_status = 'active';
                                    break;
                                }
                            }
                        }else{
                            $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                        }
            });
          }

          $scope.deactivateUser = function(user_id, email){
            showUsersService.deactivateUser(user_id, email, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('User deactivated!').position('top right'));
                            for(var i=0, j=vm.userData.length; i<j; i++){
                                if(vm.userData[i].user_id==user_id){
                                    vm.userData[i].account_status = 'inactive';
                                    break;
                                }
                            }
                        }else{
                            $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                        }
            });
          }

       

    }
})();
