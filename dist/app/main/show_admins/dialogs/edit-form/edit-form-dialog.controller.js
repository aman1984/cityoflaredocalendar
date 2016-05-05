(function ()
{
    'use strict';

    angular.module('app.dashboard')
        .controller('AdminEditFormDialogController', AdminEditFormDialogController);

    /** @ngInject */
    function AdminEditFormDialogController($mdDialog, dialogData, $scope, $mdToast, DashboardService)
    {
        var vm = this;
        // Data
        vm.dialogData = dialogData;
        console.log(vm.dialogData);
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
            vm.dialogTitle = 'Edit Admin';

            // Edit
            if ( vm.dialogData.calendarEvent )
            {
                vm.calendarEvent = angular.copy(vm.dialogData.calendarEvent);

                 vm.calendarEvent = {
                    email        : vm.dialogData.obj.email,
                    fullname          : vm.dialogData.obj.fullname
                };

            }
            console.log(vm.calendarEvent);
        };

        function saveEvent()
        {
            
            var response = {
                calendarEvent: vm.calendarEvent
            };

            $mdDialog.hide(response);
        }

        /**
         * Close the dialog
         */
        function closeDialog()
        {
            $mdDialog.cancel();
        }

    }
})();
