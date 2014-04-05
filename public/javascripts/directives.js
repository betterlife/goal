angular.module('mainApp').directive('jqdatepicker', function () {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, elem, attrs, ngModelCtrl) {
                var updateModel = function (dateText) {
                    // call $apply to bring stuff to angular model
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(dateText);
                    });
                };

                var options = {
                    dateFormat: "dd/mm/yy",
                    numberOfMonths: 3,
                    showButtonPanel: true,
                    // handle jquery date change
                    onSelect: function (dateText) {
                        updateModel(dateText);
                    }
                };

                // jqueryfy the element
                elem.datepicker(options);
            }
        };
});
