angular.module('looplereloaded')
  .controller('GridController', ['$scope', function ($scope) {

  	// load all possible instrument sounds
  	$scope.instruments = [];

  	// load the loop - lenght = 64
  	// loop will store JUST the id of a SOUND as a SOUND may be reused multiple times
  	$scope.loop = [];

  	for (var i=0; i<64; i++)
    	$scope.loop.push({
        note : null,
        id : i
      });
    debugger




  	// once we get into things
  	$scope.sounds = [
  		{
	  		inst : 'instrumentID',
	  		note : 'noteID'
	  	}
  	];

  	$scope.loop[63] = $scope.sounds[0];


  	// first controller - the sound grid

  }
]);