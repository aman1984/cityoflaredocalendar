(function ()
{
    'use strict';

    angular.module('app.pages.calendar')
        .controller('CalendarTextSearchDialogController', CalendarTextSearchDialogController);

    /** @ngInject */
    function CalendarTextSearchDialogController($mdDialog, $scope, event)
    {
        var vm = this;
        vm.closeDialog = closeDialog;
        function closeDialog()
        {
            
            $mdDialog.cancel();
        }
        $scope.clearValue = function() {
        $scope.myModel = undefined;
      };
      $scope.save = function() {
        $mdDialog.hide(vm.keyword);
      };

        
    }
})();
