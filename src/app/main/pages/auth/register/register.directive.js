(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.register')
        .directive('compareTo', compareToDirective)
        .directive('complexPassword', complexPasswordDirective);

    /** @ngInject */
    function compareToDirective()
    {
        return {
          require: "ngModel",
          scope: {
            otherModelValue: "=compareTo"
          },
          link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
              return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
              ngModel.$validate();
            });
          }
        };
    }

    function complexPasswordDirective() {
    return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(password) {
        var hasUpperCase = /[A-Z]/.test(password);
        var hasLowerCase = /[a-z]/.test(password);
        var hasNumbers = /[0-9]/.test(password);
        var hasNonalphas = /\W/.test(password);
        var characterGroupCount = hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas;

        if ((password.length >= 8) && (characterGroupCount >= 4)) {
          ctrl.$setValidity('complexity', true);
          return password;
        }
        else {
          ctrl.$setValidity('complexity', false);
          return undefined;
        }

      });
      }
    }
    }

})();