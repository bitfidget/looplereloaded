angular.module('looplereloaded')
  .directive('keypressEvents', ['$document', '$rootScope', function ($document, $rootScope) {
    return {
        restrict: 'A',
        link: function () {
            $document.bind('keydown', function (e) {
                $rootScope.$broadcast('keydown', e, (e.keyCode));
            });
        }
    };
  }
]);