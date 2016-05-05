(function ()
{
    'use strict';

    angular.module('app.show_users')
        .controller('UserChangePasswordDialogController', UserChangePasswordDialogController);

    /** @ngInject */
    function UserChangePasswordDialogController($mdDialog, $scope, $mdToast)
    {
        var vm = this;
        // Data
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
            
                 vm.calendarEvent = {
                    password : '',
                    confirm_password : ''
                };

            
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
