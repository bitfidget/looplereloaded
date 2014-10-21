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


angular.module('looplereloaded')
  .directive('soundGrid', ['$window', '$timeout', function ($window, $timeout) {
    
    // on load, stretch the grid to fill the window and break up all of the components to the right size - append new styles to head rather than directly to each dom element    
    var $winWidth = $(window).innerWidth();
    var $winHeight = $(window).innerHeight();
    var $rowHeight, $colWidth

    return {
        restrict: 'A',
        scope : true,
        link : function ($scope, $elem, $attrs) {

            $timeout(function() {
                $colWidth = ( ($winWidth - $('.instrument-title').width() ) / 64);
                $rowHeight = ( ($winHeight - $('header').outerHeight() ) / $('.grid-row').length);

                $('#grid-styles').html(".column-width {width: " + $colWidth + "px} .row-height {height: " + $rowHeight + "px}");

            });
        }
    };
}]);


angular.module('looplereloaded')
  .directive('modGrid', ['$window', '$timeout', function ($window, $timeout) {
    
    var $modList;
    var $modHeight;
    var $rowHeight;

    var resize = function(rowHeight) {
        angular.forEach($modHeight, function(elem) {
            $(elem).height(rowHeight);
        })
    };

    return {
        restrict: 'A',
        scope : {},
        link : function ($scope, $elem, $attrs) {

            $timeout(function() {
                $modList = $($elem).find('.mod-list');
                $modHeight = $($elem).find('.mod-height');
                $rowHeight = $('.row-height').height() / $modList.length;
                resize($rowHeight);
            })
        }
    };
}]);