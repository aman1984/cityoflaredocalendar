(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('dashboardController', dashboardController);

    /** @ngInject */
    function dashboardController($scope, DashboardService, $rootScope, $mdDialog, $document, $filter, $mdToast)
    {
        var vm = this;
        $scope.current_event_id = '';
        DashboardService.getUserEvents($rootScope.globals.user_data.user_id, function(data, status){
            console.log(data);
            if(data.success==true){
                vm.eventData = data.data;
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

        $scope.addEvent = function(e)
        {
            var start = new Date(),
                end = new Date(),
                obj = {};

            showEventFormDialog('add', false, start, end, e, obj);
        }

        $scope.editEvent = function(e, id, status)
        {
            var start = '',
                end = '',
                obj = {};
            $scope.current_event_id = id;
            for(var i=0, j=vm.eventData.length; i<j; i++){
                if(vm.eventData[i].event_id==id){
                    var start_time = vm.eventData[i].start_time;
                    var end_time = vm.eventData[i].end_time;
                    var start_time_array = start_time.split(':');
                    var end_time_array = end_time.split(':');
                    start = new Date(vm.eventData[i].start_date);
                    console.log(start);
                    end = new Date(vm.eventData[i].end_date);
                    obj.title = vm.eventData[i].title;
                    obj.description = vm.eventData[i].description;
                    obj.status = vm.eventData[i].status;
                    obj.categories = vm.eventData[i].categories;
                    obj.location = vm.eventData[i].location;
                    obj.attachments = vm.eventData[i].attachments;
                    obj.recurring_type = vm.eventData[i].recurring_type;
                    obj.recurring_days = vm.eventData[i].recurring_days;
                    obj.month_recurring = vm.eventData[i].month_recurring;
                    obj.link = vm.eventData[i].link;
                    obj.contact_name = vm.eventData[i].contact_name;
                    obj.contact_number = vm.eventData[i].contact_number;
                    obj.start_time_minutes = start_time_array[1];
                    obj.start_time_hours = start_time_array[0];
                    obj.end_time_hours = end_time_array[0];
                    obj.end_time_minutes = end_time_array[0];
                    obj.event_id = id;
                }
            }
            showEventFormDialog('edit', true, start, end, e, obj);
        }

        $scope.editApprovedEvent = function(e, id)
        {
            var start = '',
                end = '',
                obj = {};
            $scope.current_event_id = id;
            for(var i=0, j=vm.eventData.length; i<j; i++){
                if(vm.eventData[i].event_id==id){
                    var start_time = vm.eventData[i].start_time;
                    var end_time = vm.eventData[i].end_time;
                    var start_time_array = start_time.split(':');
                    var end_time_array = end_time.split(':');
                    start = new Date(vm.eventData[i].start_date);
                    console.log(start);
                    end = new Date(vm.eventData[i].end_date);
                    obj.title = vm.eventData[i].title;
                    obj.description = vm.eventData[i].description;
                    obj.status = vm.eventData[i].status;
                    obj.categories = vm.eventData[i].categories;
                    obj.location = vm.eventData[i].location;
                    obj.attachments = vm.eventData[i].attachments;
                    obj.recurring_type = vm.eventData[i].recurring_type;
                    obj.recurring_days = vm.eventData[i].recurring_days;
                    obj.month_recurring = vm.eventData[i].month_recurring;
                    obj.link = vm.eventData[i].link;
                    obj.contact_name = vm.eventData[i].contact_name;
                    obj.contact_number = vm.eventData[i].contact_number;
                    obj.start_time_minutes = start_time_array[1];
                    obj.start_time_hours = start_time_array[0];
                    obj.end_time_hours = end_time_array[0];
                    obj.end_time_minutes = end_time_array[0];
                    obj.event_id = id;
                }
            }

            showEventFormDialog('edit_approved', true, start, end, e, obj);
        }

        function showEventDetailDialog(calendarEvent, e)
        {
            $mdDialog.show({
                controller         : 'EventDetailDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/dashboard/dialogs/event-detail/event-detail-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    calendarEvent      : calendarEvent,
                    showEventFormDialog: showEventFormDialog,
                    event              : e
                }
            });
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
                controller         : 'EventFormDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/dashboard/dialogs/event-form/event-form-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
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
                    var start_date = $filter('date')(response.calendarEvent.start, "yyyy-MM-dd");
                    var end_date = $filter('date')(response.calendarEvent.end, "yyyy-MM-dd");
                    console.log(response.calendarEvent.attachments);
                    DashboardService.addEvent($rootScope.globals.user_data.user_id, start_date, end_date, response.calendarEvent.title, response.calendarEvent.description, response.calendarEvent.categories, response.calendarEvent.location, JSON.stringify(response.calendarEvent.attachments), response.calendarEvent.recurring, response.calendarEvent.recurring_days, response.calendarEvent.start_time_hours+':'+response.calendarEvent.start_time_minutes, response.calendarEvent.end_time_hours+':'+response.calendarEvent.end_time_minutes, response.calendarEvent.month_recurring, response.calendarEvent.link, response.calendarEvent.contact_name, response.calendarEvent.contact_number, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Event Created!').position('top right'));
                            var obj = {};
                            obj.start_date = start_date;
                            obj.end_date = end_date;
                            obj.title = response.calendarEvent.title;
                            obj.description = response.calendarEvent.description;
                            obj.event_id = data.event_id;
                            obj.status = 'pending';
                            obj.location = response.calendarEvent.location;
                            obj.categories = response.calendarEvent.categories;
                            obj.attachments = JSON.stringify(response.calendarEvent.attachments);
                            obj.recurring_type = response.calendarEvent.recurring;
                            obj.recurring_days = response.calendarEvent.recurring_days;
                            vm.eventData.push(obj);
                            console.log(vm.eventData);

                            DashboardService.notifyAdminEvent(data.event_id, function(data, status){
                        
                             });
                        }
                    });
                }
                else if(response.type=='edit')
                {
                    console.log(response);
                    var start_date = $filter('date')(response.calendarEvent.start, "yyyy-MM-dd");
                    var end_date = $filter('date')(response.calendarEvent.end, "yyyy-MM-dd");
                    if(response.calendarEvent.status=='pending'){
                    DashboardService.userEditPendingEvent($rootScope.globals.user_data.user_id, start_date, end_date, response.calendarEvent.title, response.calendarEvent.description, response.calendarEvent.categories, response.calendarEvent.location, JSON.stringify(response.calendarEvent.attachments), $scope.current_event_id, response.calendarEvent.recurring, response.calendarEvent.recurring_days, response.calendarEvent.start_time_hours+':'+response.calendarEvent.start_time_minutes, response.calendarEvent.end_time_hours+':'+response.calendarEvent.end_time_minutes, response.calendarEvent.month_recurring, response.calendarEvent.link, response.calendarEvent.contact_name, response.calendarEvent.contact_number, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Event Updated!').position('top right'));
                            for(var i=0, j=vm.eventData.length; i<j; i++){
                                if(vm.eventData[i].event_id==$scope.current_event_id){
                                    vm.eventData[i].start_date = start_date;
                                    vm.eventData[i].end_date = end_date;
                                    vm.eventData[i].title = response.calendarEvent.title;
                                    vm.eventData[i].description = response.calendarEvent.description;
                                    vm.eventData[i].location = response.calendarEvent.location;
                                    vm.eventData[i].categories = response.calendarEvent.categories;
                                    vm.eventData[i].attachments = JSON.stringify(response.calendarEvent.attachments);
                                    vm.eventData[i].recurring = response.calendarEvent.recurring;
                                    vm.eventData[i].recurring_days = response.calendarEvent.recurring_days;
                                }
                            }
                        }
                    });
                }else if(response.calendarEvent.status=='modified'){
                    DashboardService.userEditApprovedEvent($rootScope.globals.user_data.user_id, start_date, end_date, response.calendarEvent.title, response.calendarEvent.description, response.calendarEvent.categories, response.calendarEvent.location, JSON.stringify(response.calendarEvent.attachments), $scope.current_event_id, response.calendarEvent.recurring, response.calendarEvent.recurring_days, response.calendarEvent.start_time_hours+':'+response.calendarEvent.start_time_minutes, response.calendarEvent.end_time_hours+':'+response.calendarEvent.end_time_minutes, response.calendarEvent.month_recurring, response.calendarEvent.link, response.calendarEvent.contact_name, response.calendarEvent.contact_number, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Event sent for approval! Updated details will show after admin approval.').position('top right'));
                            var checkExists = false;
                            for(var i=0, j=vm.eventData.length; i<j; i++){
                                if(vm.eventData[i].event_id==$scope.current_event_id && vm.eventData[i].status=='modified'){
                                    vm.eventData[i].start_date = start_date;
                                    vm.eventData[i].end_date = end_date;
                                    vm.eventData[i].title = response.calendarEvent.title;
                                    vm.eventData[i].description = response.calendarEvent.description;
                                    vm.eventData[i].location = response.calendarEvent.location;
                                    vm.eventData[i].categories = response.calendarEvent.categories;
                                    vm.eventData[i].attachments = JSON.stringify(response.calendarEvent.attachments);
                                    vm.eventData[i].recurring = response.calendarEvent.recurring;
                                    vm.eventData[i].recurring_days = response.calendarEvent.recurring_days;
                                checkExists = true;
                                }
                            }
                            if(checkExists==false){
                            var obj = {};
                            obj.start_date = start_date;
                            obj.end_date = end_date;
                            obj.title = response.calendarEvent.title;
                            obj.description = response.calendarEvent.description;
                            obj.event_id = $scope.current_event_id;
                            obj.status = 'modified';
                            vm.eventData.push(obj);
                            }
                            DashboardService.notifyAdminEventModify($scope.current_event_id, function(data, status){
                        
                             });
                        }
                    });
                }
                    
                }else if(response.type=='edit_approved')
                {
                    console.log(response);
                    var start_date = $filter('date')(response.calendarEvent.start, "yyyy-MM-dd");
                    var end_date = $filter('date')(response.calendarEvent.end, "yyyy-MM-dd");
                    DashboardService.userEditApprovedEvent($rootScope.globals.user_data.user_id, start_date, end_date, response.calendarEvent.title, response.calendarEvent.description, response.calendarEvent.categories, response.calendarEvent.location, JSON.stringify(response.calendarEvent.attachments), $scope.current_event_id, response.calendarEvent.recurring, response.calendarEvent.recurring_days, response.calendarEvent.start_time_hours+':'+response.calendarEvent.start_time_minutes, response.calendarEvent.end_time_hours+':'+response.calendarEvent.end_time_minutes, response.calendarEvent.month_recurring, response.calendarEvent.link, response.calendarEvent.contact_name, response.calendarEvent.contact_number, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Event sent for approval! Updated details will show after admin approval.').position('top right'));
                            var checkExists = false;
                            for(var i=0, j=vm.eventData.length; i<j; i++){
                                if(vm.eventData[i].event_id==$scope.current_event_id && vm.eventData[i].status=='modified'){
                                    vm.eventData[i].start_date = start_date;
                                    vm.eventData[i].end_date = end_date;
                                    vm.eventData[i].title = response.calendarEvent.title;
                                    vm.eventData[i].description = response.calendarEvent.description;
                                    vm.eventData[i].location = response.calendarEvent.location;
                                checkExists = true;
                                }
                            }
                            if(checkExists==false){
                            var obj = {};
                            obj.start_date = start_date;
                            obj.end_date = end_date;
                            obj.title = response.calendarEvent.title;
                            obj.description = response.calendarEvent.description;
                            obj.event_id = $scope.current_event_id;
                            obj.status = 'modified';
                            vm.eventData.push(obj);
                            }
                            DashboardService.notifyAdminEventModify($scope.current_event_id, function(data, status){
                        
                            });
                        }
                    });
                    
                }
            });
        }


        $scope.showConfirm = function(ev, id) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Are you sure?')
                  .textContent('Event will be deleted.')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              DashboardService.deleteEvent($rootScope.globals.user_data.user_id, id, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Event deleted!').position('top right'));
                            for(var i=0, j=vm.eventData.length; i<j; i++){
                                if(vm.eventData[i].event_id==id){
                                    vm.eventData.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    });
            }, function() {
              
            });
          };

          $scope.pendingFilter = function (item) { 
              if (item.status === 'pending' || item.status === 'modified') {
                return item;
             }
            };

    }
})();
