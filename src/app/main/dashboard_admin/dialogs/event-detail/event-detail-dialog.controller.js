(function ()
{
    'use strict';

    angular.module('app.dashboard_admin')
        .controller('AdminEventDetailDialogController', AdminEventDetailDialogController);

    /** @ngInject */
    function AdminEventDetailDialogController($mdDialog, calendarEvent, showEventFormDialog, event, $scope)
    {
        var vm = this;
        vm.attachments = [];
        vm.days_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        vm.days_of_week_value = ['0', '1', '2', '3', '4', '5', '6'];
        var image_count = 0;
        // Data
        vm.calendarEvent = calendarEvent;
        var image_extensions = ['jpg', 'png', 'jpeg', 'PNG', 'JPG', 'JPEG'];
        var files_attachments = JSON.parse(calendarEvent.attachments);
                for(var i=0, j=files_attachments.length; i<j; i++){
                    image_count++;
                    var obj = {};
                    obj.name = files_attachments[i].name;
                    obj.temp_id = image_count;
                    obj.size = files_attachments[i].size;
                    obj.filepath = files_attachments[i].filepath;
                    obj.extension = files_attachments[i].extension;
                    if(image_extensions.indexOf(files_attachments[i].extension)>-1){
                    obj.isImage = true;
                    }else{
                    obj.isImage = false;
                    }   
                    obj.uploading = false;
                    vm.attachments.push(obj);
                }
        // Methods
        vm.editEvent = editEvent;
        vm.closeDialog = closeDialog;

        //////////
        function closeDialog()
        {
            
            $mdDialog.cancel();
        }

        function editEvent(calendarEvent)
        {
            showEventFormDialog('edit', calendarEvent, false, false, event);
        }
        $scope.getdays = function(days){
            var days_array = days.split(',');
            var days_name = '';
            for(var i=0, j=days_array.length; i<j; i++){
                days_name+= vm.days_of_week[days_array[i]]+', ';
            }
            days_name = days_name.replace(/,\s*$/, "");
            return days_name; 
        }
    }
})();
