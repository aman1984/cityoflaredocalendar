(function ()
{
    'use strict';

    angular
        .module('app.pages.terms_and_condition')
        .controller('TermsController', TermsController);

    /** @ngInject */
    function TermsController($scope, $http, TermsService)
    {
        // Data
            TermsService.getTermsText(function(data, status){
            console.log(data);
            if(data.success==true){
                $scope.termsText = data.data;
            }else{
                $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
            }
        });
    }
})();