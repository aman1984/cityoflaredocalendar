(function ()
{
    'use strict';

    angular.module('app.pages.calendar')
        .controller('CalendarSearchDialogController', CalendarSearchDialogController);

    /** @ngInject */
    function CalendarSearchDialogController($mdDialog, $scope, event)
    {
        var vm = this;
        vm.closeDialog = closeDialog;
        vm.categories = ['Social events', 'Sports', 'Entertainment/Music', 'Arts', 'Religious events', 'Fundraiser', 'City events', 'Government events', 'Cultural', 'Education', 'Environmental'];
        $scope.selected = [];
        function closeDialog()
        {
            
            $mdDialog.cancel();
        }
        $scope.clearValue = function() {
        $scope.myModel = undefined;
      };
      $scope.save = function() {
        var selected_categories = $scope.selected.join();
        $mdDialog.hide(selected_categories);
      };

      $scope.splitItem = function(item){
        var str = item.split(',')[0].replace(/[ \/]/g, '');
        return str+'Cat';
      }

      $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);

      };
      $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
      };
        
    }
})();
