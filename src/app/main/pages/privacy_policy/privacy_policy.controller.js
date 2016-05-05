(function ()
{
    'use strict';

    angular
        .module('app.pages.privacy_policy')
        .controller('PricavyPolicyController', PricavyPolicyController);

    /** @ngInject */
    function PricavyPolicyController($scope, $http, editPrivacyPolicyService)
    {
        // Data
            editPrivacyPolicyService.getPrivacyPolicyText(function(data, status){
            console.log(data);
            if(data.success==true){
                $scope.privacyText = data.data;
            }else{
                $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
            }
        });
    }
})();