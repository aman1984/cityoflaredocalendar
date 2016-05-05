(function ()
{
    'use strict';

    angular
        .module('app.pages.calendar')
        .controller('CalendarController', CalendarController);

    /** @ngInject */
    function CalendarController($mdDialog, $document, CalendarService, $mdToast, $filter, $state, $interval, $location)
    {
        var vm = this;
        vm.selected_event = $location.search().event_details;
        // Data
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var eventsData = [];
        vm.events = [];
        vm.background_image = '';
        var imageCounter = 0;
        CalendarService.getBannerImages(function(data, status){
                    if(data.success==true){
                    vm.banner_images = [];
                    var image_count = 0;
                    var files_attachments = JSON.parse(data.data.images);
                    for(var i=0, j=files_attachments.length; i<j; i++){
                        image_count++;
                        var obj = {};
                        obj.name = files_attachments[i].name;
                        obj.temp_id = image_count;
                        obj.size = files_attachments[i].size;
                        obj.filepath = files_attachments[i].filepath;
                        obj.extension = files_attachments[i].extension;
                        obj.uploading = false;
                        vm.banner_images.push(obj);
                    }
                    vm.background_image = vm.banner_images[0].filepath;
                }
        });

        $interval(function(){
            if(vm.background_image!==''){
                if((imageCounter+1) > vm.banner_images.length){
                    imageCounter = 0;
                }
                vm.background_image = vm.banner_images[imageCounter].filepath;
                imageCounter++;
            } 
        }, 5000);

        CalendarService.showApprovedEvents('', function(data, status){
            console.log(data);
            if(data.success==true){
                var events = data.data;
                putEventsOnCalendar(data);
                    console.log('selected');
                    for(var i=0, j=eventsData.length; i<j; i++){
                        if(eventsData[i].id==vm.selected_event){
                            showEventDetailDialog(eventsData[i], '', true);
                            break;
                        }
                    }
            }else{
                $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
            }
        });

        function putEventsOnCalendar(data){
            for(var i=0, j=data.data.length; i<j; i++){
                    var obj = {};
                    var new_start_date = convertDate(data.data[i].start_date, data.data[i].start_time);
                    var new_end_date = convertDate(data.data[i].end_date, data.data[i].end_time);
                    obj.id = data.data[i].event_id;
                    obj.title = data.data[i].title;
                    obj.description = data.data[i].description;
                    obj.location = data.data[i].location;
                    obj.attachments = data.data[i].attachments;
                    obj.categories = data.data[i].categories;
                    obj.recurring = data.data[i].recurring_type;
                    obj.recurring_days = data.data[i].recurring_days;
                    obj.link = data.data[i].link;
                    obj.contact_name = data.data[i].contact_name;
                    obj.contact_number = data.data[i].contact_number;
                    //obj.start = new Date(data.data[i].start_date+':'+data.data[i].start_time);
                    obj.start = new_start_date;
                    //obj.end = new Date(data.data[i].end_date+':'+data.data[i].end_time);
                    obj.end = new_end_date;
                    obj.className = [data.data[i].categories.split(',')[0].replace(/[ \/]/g, '')];
                    var timeDiff = Math.abs(obj.end.getTime() - obj.start.getTime());
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                    
                    //var start_date = new Date(data.data[i].start_date+':'+data.data[i].start_time);
                    var start_date = obj.start;
                    //var end_date = new Date(data.data[i].end_date+':'+data.data[i].end_time);
                    var end_date = obj.end;
                    if(diffDays>1){
                        if(obj.recurring=='weekly'){

                            var dow = [];
                            dow = obj.recurring_days.split(',');
                            // loop through dates and find the day and display it.
                            while (start_date < end_date) {
                                var obj2 = {};
                                var dateDay = start_date.getDay();
                                dateDay = dateDay.toString();
                               // var new_end_date = new Date(end_y, end_m, end_d, end_time_array[0], end_time_array[1]);
                                var new_end_date = convertDateWeeklyMonthly(start_date, data.data[i].end_time);
                               // var new_start_date = new Date(start_y, start_m, start_d, start_time_array[0], start_time_array[1]);
                                var new_start_date = convertDateWeeklyMonthly(start_date, data.data[i].start_time);
                                if(dow.indexOf(dateDay)>-1){
                                    obj2.id = data.data[i].event_id;
                                    obj2.title = data.data[i].title;
                                    obj2.description = data.data[i].description;
                                    obj2.location = data.data[i].location;
                                    obj2.attachments = data.data[i].attachments;
                                    obj2.categories = data.data[i].categories;
                                    obj2.recurring = data.data[i].recurring_type;
                                    obj2.recurring_days = data.data[i].recurring_days;
                                    obj2.link = data.data[i].link;
                                    obj2.contact_name = data.data[i].contact_name;
                                    obj2.contact_number = data.data[i].contact_number;
                                    obj2.start = new_start_date;
                                    obj2.end = new_end_date;
                                    obj2.allDay = false;
                                    obj2.className = [data.data[i].categories.split(',')[0].replace(/[ \/]/g, '')];
                                    eventsData.push(obj2); 
                                }
                                start_date = new Date(start_date.setDate(start_date.getDate() + 1));
                              }

                        
                        }else if(obj.recurring=='monthly'){
                            // loop through dates and find the day and display it.
                            var monthly_recurring = JSON.parse(data.data[i].month_recurring);
                            var monthly_recurring_type = monthly_recurring.month_recurring_type;
                            while (start_date < end_date) {
                                var obj2 = {};
                                var dateDay = start_date.getDay();
                                var by_day_date;
                                var by_day_week;
                                dateDay = dateDay.toString();
                                // var new_end_date = new Date(end_y, end_m, end_d, end_time_array[0], end_time_array[1]);
                                var new_end_date = convertDateWeeklyMonthly(start_date, data.data[i].end_time);
                               // var new_start_date = new Date(start_y, start_m, start_d, start_time_array[0], start_time_array[1]);
                                var new_start_date = convertDateWeeklyMonthly(start_date, data.data[i].start_time);

                                if(monthly_recurring_type=='by_day'){
                                    by_day_date = monthly_recurring.by_day_recurring;
                                    by_day_week = monthly_recurring.by_day_week;
                                    var getDayDate = start_date.getDate();
                                    if(dateDay==by_day_date){
                                     var getWeek = Math.ceil(parseInt(getDayDate)/7);
                                    if(getWeek==by_day_week){
                                    obj2.id = data.data[i].event_id;
                                    obj2.title = data.data[i].title;
                                    obj2.description = data.data[i].description;
                                    obj2.location = data.data[i].location;
                                    obj2.attachments = data.data[i].attachments;
                                    obj2.categories = data.data[i].categories;
                                    obj2.recurring = data.data[i].recurring_type;
                                    obj2.recurring_days = data.data[i].recurring_days;
                                    obj2.link = data.data[i].link;
                                    obj2.contact_name = data.data[i].contact_name;
                                    obj2.contact_number = data.data[i].contact_number;
                                    obj2.start = new_start_date;
                                    obj2.end = new_end_date;
                                    obj2.allDay = false;
                                    obj2.className = [data.data[i].categories.split(',')[0].replace(/[ \/]/g, '')];
                                    eventsData.push(obj2);
                                    }
                                    }
                                }else{
                                    var compare_date = monthly_recurring.by_date_recurring;
                                    var getDate = new_start_date.getDate();
                                    if(getDate==compare_date){
                                        obj2.id = data.data[i].event_id;
                                        obj2.title = data.data[i].title;
                                        obj2.description = data.data[i].description;
                                        obj2.location = data.data[i].location;
                                        obj2.attachments = data.data[i].attachments;
                                        obj2.categories = data.data[i].categories;
                                        obj2.recurring = data.data[i].recurring_type;
                                        obj2.recurring_days = data.data[i].recurring_days;
                                        obj2.link = data.data[i].link;
                                        obj2.contact_name = data.data[i].contact_name;
                                        obj2.contact_number = data.data[i].contact_number;
                                        obj2.start = new_start_date;
                                        obj2.end = new_end_date;
                                        obj2.allDay = false;
                                        obj2.className = [data.data[i].categories.split(',')[0].replace(/[ \/]/g, '')];
                                        eventsData.push(obj2);
                                    }
                                }
                                
                                start_date = new Date(start_date.setDate(start_date.getDate() + 1));
                              }
                        }else{
                        obj.allDay = false;
                        eventsData.push(obj);
                        }
                    }else{
                        obj.allDay = false;
                        eventsData.push(obj);
                    }
                }
                vm.events.push(eventsData);
        }

        function convertDate(date, time){
            var start_date_test = new Date(date);
            var start_d = start_date_test.getDate();
            var start_m = start_date_test.getMonth();
            var start_y = start_date_test.getFullYear();

            var start_time_array = time.split(':');

            return new Date(start_y, start_m, start_d, start_time_array[0], start_time_array[1]);
        }

        function convertDateWeeklyMonthly(date, time){
            var start_d = date.getDate();
            var start_m = date.getMonth();
            var start_y = date.getFullYear();

            var start_time_array = time.split(':');

            return new Date(start_y, start_m, start_d, start_time_array[0], start_time_array[1]);
        }

        

        vm.calendarUiConfig = {
            calendar: {
                editable          : false,
                eventLimit        : true,
                header            : '',
                handleWindowResize: false,
                aspectRatio       : 1,
                dayNames          : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                dayNamesShort     : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                viewRender        : function (view)
                {
                    vm.calendarView = view;
                    vm.calendar = vm.calendarView.calendar;
                    vm.currentMonthShort = vm.calendar.getDate().format('MMM');
                },
                columnFormat      : {
                    month: 'ddd',
                    week : 'ddd D',
                    day  : 'ddd M'
                },
                eventClick        : eventDetail,
                selectable        : true,
                selectHelper      : true,
                select            : select
            }
        };

        // Methods
        vm.addEvent = addEvent;
        vm.next = next;
        vm.prev = prev;

        //////////

        /**
         * Go to next on current view (week, month etc.)
         */
        function next()
        {
            vm.calendarView.calendar.next();
        }

        /**
         * Go to previous on current view (week, month etc.)
         */
        function prev()
        {
            vm.calendarView.calendar.prev();
        }

        /**
         * Show event detail
         *
         * @param calendarEvent
         * @param e
         */
        function eventDetail(calendarEvent, e)
        {
            $location.search('event_details', calendarEvent.id);
            showEventDetailDialog(calendarEvent, e, false);
        }

        /**
         * Add new event in between selected dates
         *
         * @param start
         * @param end
         * @param e
         */
        function select(start, end, e)
        {
            showEventFormDialog('add', false, start, end, e);
        }

        /**
         * Add event
         *
         * @param e
         */
        function addEvent(e)
        {
            var start = new Date(),
                end = new Date();

            showEventFormDialog('add', false, start, end, e);
        }

        vm.searchPopup = function(e)
        {
            $mdDialog.show({
                controller         : 'CalendarSearchDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/pages/calendar/dialogs/search/search-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    event              : e
                }
            }).then(function (response)
            {
                $mdToast.show($mdToast.simple().textContent('Getting events. Please wait!').position('top right'));
                vm.events.splice(0, 1);
            CalendarService.searchApprovedEvents(response, function(data, status){
            console.log(data);
            eventsData = [];
            if(data.success==true){
                if(data.data.length>0){
                    var toastText = '';
                    if(data.data.length==1){
                        toastText = 'Found 1 event!';
                    }else{
                        toastText = 'Found '+data.data.length+' events!';
                    }
                    $mdToast.show($mdToast.simple().textContent(toastText).position('top right'));
                    var events = data.data;
                    putEventsOnCalendar(data);
                    if(events.length>0){
                        vm.calendarView.calendar.gotoDate(convertDate(events[0].start_date, events[0].start_time));
                    }
                }else{
                    $mdToast.show($mdToast.simple().textContent('No event found!').position('top right'));
                }
                       
            }else{
                $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
            }
        });
            });
        }


        vm.textSearchPopup = function(e)
        {
            $mdDialog.show({
                controller         : 'CalendarTextSearchDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/pages/calendar/dialogs/text_search/text-search-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    event              : e
                }
            }).then(function (response)
            {
                $mdToast.show($mdToast.simple().textContent('Getting events. Please wait!').position('top right'));
                vm.events.splice(0, 1);
            CalendarService.textSearchApprovedEvents(response, function(data, status){
            console.log(data);
            eventsData = [];
            if(data.success==true){
                if(data.data.length>0){
                    var toastText = '';
                    if(data.data.length==1){
                        toastText = 'Found 1 event!';
                    }else{
                        toastText = 'Found '+data.data.length+' events!';
                    }
                    $mdToast.show($mdToast.simple().textContent(toastText).position('top right'));
                    var events = data.data;
                    putEventsOnCalendar(data);
                    if(events.length>0){
                        vm.calendarView.calendar.gotoDate(convertDate(events[0].start_date, events[0].start_time));
                    }
                }else{
                    $mdToast.show($mdToast.simple().textContent('No event found!').position('top right'));
                }
                       
            }else{
                $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
            }
        });
            });
        }

        /**
         * Show event detail dialog
         * @param calendarEvent
         * @param e
         */
        function showEventDetailDialog(calendarEvent, e, event_preselected)
        {
            $mdDialog.show({
                controller         : 'CalendarEventDetailDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/pages/calendar/dialogs/event-detail/event-detail-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    calendarEvent      : calendarEvent,
                    showEventFormDialog: showEventFormDialog,
                    event_preselected: event_preselected,
                    event              : e
                }
            }).then(function(answer) {

            }, function() {
              $location.search('event_details', null);
            });
        }

        /**
         * Show event add/edit form dialog
         *
         * @param type
         * @param calendarEvent
         * @param start
         * @param end
         * @param e
         */
        function showEventFormDialog(type, calendarEvent, start, end, e)
        {
            return;
            var dialogData = {
                type         : type,
                calendarEvent: calendarEvent,
                start        : start,
                end          : end
            };

            $mdDialog.show({
                controller         : 'EventFormDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/pages/calendar/dialogs/event-form/event-form-dialog.html',
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
                    // Add new
                    vm.events[0].push({
                        id   : vm.events[0].length + 20,
                        title: response.calendarEvent.title,
                        start: response.calendarEvent.start,
                        end  : response.calendarEvent.end
                    });
                }
                else
                {
                    for ( var i = 0; i < vm.events[0].length; i++ )
                    {
                        // Update
                        if ( vm.events[0][i].id === response.calendarEvent.id )
                        {
                            vm.events[0][i] = {
                                title: response.calendarEvent.title,
                                start: response.calendarEvent.start,
                                end  : response.calendarEvent.end
                            };

                            break;
                        }
                    }
                }
            });
        }

        vm.redirectLogin = function(){
            $state.go('app.pages_auth_login');
        }

    }

})();