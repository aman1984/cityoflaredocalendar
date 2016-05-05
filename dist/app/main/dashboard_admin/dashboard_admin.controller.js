(function ()
{
    'use strict';

    angular
        .module('app.dashboard_admin')
        .controller('dashboard_adminController', dashboard_adminController);

    /** @ngInject */
    function dashboard_adminController($scope, DashboardAdminService, $rootScope, $mdDialog, $document, $filter, $mdToast)
    {
        var vm = this;
        DashboardAdminService.getAllEvents($rootScope.globals.user_data.user_id, function(data, status){
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

        $scope.approveEvent = function(id, event_status){
            DashboardAdminService.approveEvent(id, event_status, function(data, status){
            console.log(data);
            if(data.success==true){
                $mdToast.show($mdToast.simple().textContent('Event approved!').position('top right'));
                var events = angular.copy(vm.eventData)
                for(var i=0, j=events.length; i<j; i++){
                if(events[i].event_id==id && events[i].status=='pending' && event_status=='pending'){
                    events[i].status = 'approved';
                }else if(event_status=='modified'){
                    if(events[i].event_id==id && events[i].status=='approved'){
                        // random status to remove from approved list
                        events[i].status = 'remove';
                    }
                    if(events[i].event_id==id && events[i].status=='modified'){
                        events[i].status = 'approved';
                    }
                }
                }
                vm.eventData = events;
            }else{
                $mdToast.show($mdToast.simple().textContent('No data found!').position('top right'));
            }
            });
        }

         function declineEvent(id, event_status){
            DashboardAdminService.declineEvent(id, event_status,  function(data, status){
            console.log(data);
            if(data.success==true){
                $mdToast.show($mdToast.simple().textContent('Event declined!').position('top right'));
                var events = angular.copy(vm.eventData)
                for(var i=0, j=events.length; i<j; i++){
                if(events[i].event_id==id && events[i].status=='pending' && event_status=='pending'){
                    events[i].status = 'declined';
                }else if(events[i].event_id==id && events[i].status=='modified' && event_status=='modified'){
                    events[i].status = 'rejected';
                }
                }
                vm.eventData = events;
            }else{
                $mdToast.show($mdToast.simple().textContent('No data found!').position('top right'));
            }
            });
        }

        function deleteEvent(id){
            DashboardAdminService.deleteEvent(id,  function(data, status){
            console.log(data);
            if(data.success==true){
                $mdToast.show($mdToast.simple().textContent('Event deleted!').position('top right'));
                var events = angular.copy(vm.eventData)
                for(var i=0, j=events.length; i<j; i++){
                if(events[i].event_id==id){
                    events.splice(i, 1);
                    break;
                }
                }
                vm.eventData = events;
            }else{
                $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
            }
            });
        }

        $scope.viewEvent = function(e, data)
        {
            var start = new Date(),
                end = new Date(),
                obj = {};
                obj.start = new Date(data.start_date);
                obj.end = new Date(data.end_date);
                obj.title = data.title;
                obj.description = data.description;
                obj.categories = data.categories;
                obj.location = data.location;
                obj.attachments = data.attachments;
                obj.recurring = data.recurring_type;
                obj.recurring_days = data.recurring_days;
                obj.month_recurring = data.month_recurring;
                obj.link = data.link;
                obj.contact_name = data.contact_name;
                obj.contact_number = data.contact_number;
            showEventDetailDialog(obj, e);
        }

        $scope.addEvent = function(e)
        {
            var start = new Date(),
                end = new Date(),
                obj = {};

            showEventFormDialog('add', false, start, end, e, obj);
        }

        $scope.editEvent = function(e, id)
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
                    break;
                }
            }
            console.log(obj);
            showEventFormDialog('edit', true, start, end, e, obj);
        }

        function showEventDetailDialog(calendarEvent, e)
        {
            $mdDialog.show({
                controller         : 'AdminEventDetailDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/dashboard_admin/dialogs/event-detail/event-detail-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: false,
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
                controller         : 'AdminEventFormDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/dashboard_admin/dialogs/event-form/event-form-dialog.html',
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
                    var start_date = $filter('date')(response.calendarEvent.start, "yyyy-MM-dd");
                    var end_date = $filter('date')(response.calendarEvent.end, "yyyy-MM-dd");
                    DashboardAdminService.addEventAdmin($rootScope.globals.user_data.admin_id, start_date, end_date, response.calendarEvent.title, response.calendarEvent.description, response.calendarEvent.categories, response.calendarEvent.location, JSON.stringify(response.calendarEvent.attachments), response.calendarEvent.recurring, response.calendarEvent.recurring_days, response.calendarEvent.start_time_hours+':'+response.calendarEvent.start_time_minutes, response.calendarEvent.end_time_hours+':'+response.calendarEvent.end_time_minutes, response.calendarEvent.month_recurring, response.calendarEvent.link, response.calendarEvent.contact_name, response.calendarEvent.contact_number, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            var obj = {};
                            obj.start_date = start_date;
                            obj.end_date = end_date;
                            obj.title = response.calendarEvent.title;
                            obj.description = response.calendarEvent.description;
                            obj.event_id = data.event_id;
                            obj.status = 'approved';
                            obj.location = response.calendarEvent.location;
                            obj.categories = response.calendarEvent.categories;
                            obj.attachments = JSON.stringify(response.calendarEvent.attachments);
                            obj.recurring_type = response.calendarEvent.recurring;
                            obj.recurring_days = response.calendarEvent.recurring_days;
                            vm.eventData.push(obj);
                            console.log(vm.eventData);
                        }
                    });
                }
                else
                {
                    var start_date = $filter('date')(response.calendarEvent.start, "yyyy-MM-dd");
                    var end_date = $filter('date')(response.calendarEvent.end, "yyyy-MM-dd");
                    DashboardAdminService.adminEditEvent(start_date, end_date, response.calendarEvent.title, response.calendarEvent.description, response.calendarEvent.categories, response.calendarEvent.location, JSON.stringify(response.calendarEvent.attachments), $scope.current_event_id, response.calendarEvent.recurring, response.calendarEvent.recurring_days, response.calendarEvent.start_time_hours+':'+response.calendarEvent.start_time_minutes, response.calendarEvent.end_time_hours+':'+response.calendarEvent.end_time_minutes, response.calendarEvent.month_recurring, response.calendarEvent.link, response.calendarEvent.contact_name, response.calendarEvent.contact_number, function(data, status){
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
                
                    
                }
            });
        }

        $scope.showConfirm = function(ev, id, status) {
            var confirm = $mdDialog.confirm()
                  .title('Are you sure?')
                  .textContent('Event will be declined.')
                  .targetEvent(ev)
                  .ok('Decline')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                declineEvent(id, status);
            }, function() {
              
            });
          };

          $scope.showConfirmDeleteEvent = function(ev, id) {
            var confirm = $mdDialog.confirm()
                  .title('Are you sure?')
                  .textContent('Event will be deleted.')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                deleteEvent(id);
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
