angular.module('looplereloaded')
  .controller('GridController', ['$scope', function ($scope) {

  	// load all possible modument sounds
  	$scope.mods = [
      {
        mod : '0',  // refers to the intrument array which includes sound file, colour, name etc
        note : '0' // refers to the actual note, will probably also need to inlcude some extra things (vibrato? pitch? length?)
      },
      {
        mod : '1',  // refers to the intrument array which includes sound file, colour, name etc
        note : '0' // refers to the actual note, will probably also need to inlcude some extra things (vibrato? pitch? length?)
      },
      {
        mod : '2',  // refers to the intrument array which includes sound file, colour, name etc
        note : '0' // refers to the actual note, will probably also need to inlcude some extra things (vibrato? pitch? length?)
      },
      {
        mod : '3',  // refers to the intrument array which includes sound file, colour, name etc
        note : '0', // refers to the actual note, will probably also need to inlcude some extra things (vibrato? pitch? length?)
      }
    ];

  	// load the loop - lenght = 64
  	// loop will store JUST the id of a SOUND as a SOUND may be reused multiple times
  	$scope.loop = [];

  	for (var i=0; i<64; i++)
    	$scope.loop.push({
        note : null,
        id : i + 1
      });




  	// once we get into things
  	$scope.sounds = [
  		{
	  		inst : 'instrumentID',
	  		note : 'noteID'
	  	}
  	];

  	// first controller - the sound grid
    $scope.gridClick = function(beat, instrument) {
      if ($scope.loop[beat].note) {
        $scope.loop[beat].note.push({sound : instrument})
      } else {
        $scope.loop[beat].note = [{sound : instrument}];
      }
      console.log($scope.loop[beat].note)
    }



  }
]);