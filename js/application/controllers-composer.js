angular.module('looplereloaded')
  .controller('GridController', ['$scope', function ($scope) {

  	// load all possible instrument sounds
  	$scope.instruments = [
      {
        instr : '0',  // refers to the intrument array which includes sound file, colour, name etc
        note : '0' // refers to the actual note, will probably also need to inlcude some extra things (vibrato? pitch? length?)
      },
      {
        instr : '1',  // refers to the intrument array which includes sound file, colour, name etc
        note : '0' // refers to the actual note, will probably also need to inlcude some extra things (vibrato? pitch? length?)
      },
      {
        instr : '2',  // refers to the intrument array which includes sound file, colour, name etc
        note : '0' // refers to the actual note, will probably also need to inlcude some extra things (vibrato? pitch? length?)
      },
      {
        instr : '3',  // refers to the intrument array which includes sound file, colour, name etc
        note : '0', // refers to the actual note, will probably also need to inlcude some extra things (vibrato? pitch? length?)
      },
      {
        instr : '4',  // refers to the intrument array which includes sound file, colour, name etc
        note : '0', // refers to the actual note, will probably also need to inlcude some extra things (vibrato? pitch? length?)
        mods : [
          { mod : 'a' },
          { mod : 'b' },
          { mod : 'c' }
           // refers to variants of the same instrument --> should these be grouped manually???
        ]
      },
      {
        instr : '5',  // refers to the intrument array which includes sound file, colour, name etc
        note : '0', // refers to the actual note, will probably also need to inlcude some extra things (vibrato? pitch? length?)
        mods : [
          { mod : 'a' },
          { mod : 'b' },
          { mod : 'c' },
          { mod : 'd' },
          { mod : 'e' }
           // refers to variants of the same instrument --> should these be grouped manually???
        ]
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

  	$scope.loop[63] = $scope.sounds[0];


  	// first controller - the sound grid

  }
]);