(function ()
{
    'use strict';

    angular
        .module('app.pages.privacy_policy')
        .controller('PricavyPolicyController', PricavyPolicyController);

    /** @ngInject */
    function PricavyPolicyController($scope, $http, PrivacyPolicyService)
    {
        // Data
            PrivacyPolicyService.getTermsText(function(data, status){
            console.log(data);
            if(data.success==true){
                $scope.termsText = data.data;
            }else{
                $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
            }
        });
    }
})();