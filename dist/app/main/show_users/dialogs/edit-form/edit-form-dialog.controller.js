(function ()
{
    'use strict';

    angular.module('app.show_users')
        .controller('UserEditFormDialogController', UserEditFormDialogController);

    /** @ngInject */
    function UserEditFormDialogController($mdDialog, dialogData, $scope, $mdToast, DashboardService)
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
            vm.dialogTitle = 'Edit User';

            // Edit
            if ( vm.dialogData.calendarEvent )
            {
                vm.calendarEvent = angular.copy(vm.dialogData.calendarEvent);

                 vm.calendarEvent = {
                    email        : vm.dialogData.obj.email,
                    name          : vm.dialogData.obj.name,
                    last_name          : vm.dialogData.obj.last_name,
                    middle_name          : vm.dialogData.obj.middle_name,
                    title          : vm.dialogData.obj.title,
                    organization          : vm.dialogData.obj.organization,
                    phone          : vm.dialogData.obj.phone
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
