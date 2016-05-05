(function ()
{
    'use strict';

    angular.module('app.dashboard')
        .controller('EventFormDialogController', EventFormDialogController);

    /** @ngInject */
    function EventFormDialogController($mdDialog, dialogData, $scope, DashboardService, $mdToast)
    {
        var vm = this;
        vm.categories = ['Social events', 'Sports', 'Entertainment/Music', 'Arts', 'Religious events', 'Fundraiser', 'City events', 'Government events', 'Cultural', 'Education', 'Environmental'];
        vm.days_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        vm.days_of_week_value = ['0', '1', '2', '3', '4', '5', '6'];
        vm.hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        vm.minutes = [];
        vm.dates = [];
        for(var i=1; i<=31; i++){
            vm.dates.push(i.toString());
        }

        $scope.selected = [];
        $scope.selectedDays = [];
        vm.attachments = [];
        vm.uploaded_file = [];
        var image_count = 0;
        $scope.uploadingFile = false;
        $scope.showDays = false;
        // Data
        vm.dialogData = dialogData;
        vm.notifications = ['15 minutes before', '30 minutes before', '1 hour before'];

        // Methods
        vm.saveEvent = saveEvent;
        vm.closeDialog = closeDialog;
        init();

        //////////

        /**
         * Initialize
         */
        function init()
        {
            vm.dialogTitle = (vm.dialogData.type === 'add' ? 'Add Event' : 'Edit Event');

            // Edit
            if ( vm.dialogData.calendarEvent )
            {
                // Clone the calendarEvent object before doing anything
                // to make sure we are not going to brake the Full Calendar
                vm.calendarEvent = angular.copy(vm.dialogData.calendarEvent);

                // Convert moment.js dates to javascript date object
                if ( moment.isMoment(vm.calendarEvent.start) )
                {
                    vm.calendarEvent.start = vm.calendarEvent.start.toDate();
                }

                if ( moment.isMoment(vm.calendarEvent.end) )
                {
                    vm.calendarEvent.end = vm.calendarEvent.end.toDate();
                }
                 vm.calendarEvent = {
                    start        : vm.dialogData.start,
                    end          : vm.dialogData.end,
                    title: vm.dialogData.obj.title,
                    location: vm.dialogData.obj.location,
                    description: vm.dialogData.obj.description,
                    status: vm.dialogData.obj.status,
                    recurring: vm.dialogData.obj.recurring_type,
                    start_time_minutes: vm.dialogData.obj.start_time_minutes,
                    start_time_hours: vm.dialogData.obj.start_time_hours,
                    end_time_hours: vm.dialogData.obj.end_time_hours,
                    end_time_minutes: vm.dialogData.obj.end_time_minutes,
                    month_recurring_type : '',
                    by_date_recurring : '',
                    by_day_recurring : '',
                    by_day_week : '',
                    link : vm.dialogData.obj.link,
                    contact_name : vm.dialogData.obj.contact_name,
                    contact_number : vm.dialogData.obj.contact_number
                };
                var files_attachments = JSON.parse(vm.dialogData.obj.attachments);
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
                }
                //vm.uploaded_file = vm.dialogData.attachments.split(',');
                var categories_array = vm.dialogData.obj.categories.split(',');
                $scope.selected = categories_array; 
                console.log(vm.dialogData.obj.recurring_days);
                if(vm.dialogData.obj.recurring_days!=''){
                var recurring_days_array = vm.dialogData.obj.recurring_days.split(',');
                $scope.selectedDays = recurring_days_array;
                }

                var month_recurring = vm.dialogData.obj.month_recurring;
                console.log(month_recurring);
                if(month_recurring!==''){
                    month_recurring = JSON.parse(month_recurring);
                    vm.calendarEvent.month_recurring_type = month_recurring.month_recurring_type;
                    vm.calendarEvent.by_day_recurring = month_recurring.by_day_recurring;
                    vm.calendarEvent.by_date_recurring = month_recurring.by_date_recurring;
                    vm.calendarEvent.by_day_week = month_recurring.by_day_week;
                }
            }
            // Add
            else
            {
                // Convert moment.js dates to javascript date object
                if ( moment.isMoment(vm.dialogData.start) )
                {
                    vm.dialogData.start = vm.dialogData.start.toDate();
                }

                if ( moment.isMoment(vm.dialogData.end) )
                {
                    vm.dialogData.end = vm.dialogData.end.toDate();
                }

                vm.calendarEvent = {
                    start        : vm.dialogData.start,
                    end          : vm.dialogData.end,
                    description          : '',
                    recurring          : 'no-repeat',
                    start_time_minutes          : '00',
                    end_time_minutes          : '59',
                    start_time_hours          : '01',
                    end_time_hours          : '23',
                    month_recurring_type : '',
                    by_date_recurring : '',
                    by_day_recurring : '',
                    by_day_week : '',
                    link : '',
                    contact_name : '',
                    contact_number : '',
                    notifications: []
                };


            }

            for(var i=0; i<60; i++){
            i = i.toString();
            if(i<10){
                i = '0'+i;
            }
            vm.minutes.push(i);
            }
        }

        function saveEvent()
        {
            var month_recurring = {};
            month_recurring.month_recurring_type = vm.calendarEvent.month_recurring_type;
            month_recurring.by_date_recurring = vm.calendarEvent.by_date_recurring;
            month_recurring.by_day_recurring = vm.calendarEvent.by_day_recurring;
            month_recurring.by_day_week = vm.calendarEvent.by_day_week;
            var month_recurring_final = JSON.stringify(month_recurring);
            
            vm.calendarEvent.categories = $scope.selected.join();
            vm.calendarEvent.recurring_days = $scope.selectedDays.join();
            vm.calendarEvent.attachments = vm.uploaded_file;
            vm.calendarEvent.month_recurring = month_recurring_final;
            var response = {
                type         : vm.dialogData.type,
                calendarEvent: vm.calendarEvent
            };

            $mdDialog.hide(response);
        }

        $scope.attachFile = function(){
            document.getElementById('attach_file').click();
        }

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
            var file = document.getElementById('attach_file').files[0];
            formData.append('attachment', file);
            $scope.uploadingFile = true;
            $mdToast.show($mdToast.simple().textContent('Uploading!').position('top right'));
            DashboardService.uploadFile(formData, function(data, status){
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

                    //vm.uploaded_file.push(data.filepath);
                    for(var i=0, j=vm.attachments.length; i<j; i++){
                        if(vm.attachments[i].temp_id==obj.temp_id){
                            vm.attachments[i].uploading = false;
                            vm.attachments[i].filepath = data.filepath;
                        }
                    }
                }else{
                    $mdToast.show($mdToast.simple().textContent('Not able to upload!').position('top right'));
                }
            });
          }

          $scope.deleteFile = function(id, filename){
            for(var i=0, j=vm.attachments.length; i<j; i++){
                if(vm.attachments[i].temp_id==id){
                    vm.attachments.splice(i, 1);
                }
            }
            for(var i=0, j=vm.uploaded_file.length; i<j; i++){
                if(vm.uploaded_file[i].filepath==filename){
                    vm.uploaded_file.splice(i, 1);
                }
            }
            $mdToast.show($mdToast.simple().textContent('Attachment deleted!').position('top right'));
          }

        /**
         * Close the dialog
         */
        function closeDialog()
        {
            $mdDialog.cancel();
        }


        
      $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);

      };
      $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
      };

      $scope.toggleDays = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);

      };
      $scope.existsDays = function (item, list) {
        return list.indexOf(item) > -1;
      };


    }
})();
