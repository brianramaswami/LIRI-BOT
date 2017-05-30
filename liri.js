
var fs = require("fs");							//NPM package for reading and writing files

var keys = require("./keys.js");				//Twitter keys and access tokens
var Twitter = require("twitter");				//NPM package for twitter
var client = new Twitter(keys.twitterKeys);		//New instance of a twitter client

var request = require("request");				//NPM package for making ajax-like calls

var spotify = require("spotify");				//NPM package for spotify

var userCommand = process.argv[2];
var title = process.argv[3];

var nodeArgs = process.argv;
// Create an empty variable for holding the movie name
var movieName = "";
// Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s
for (var i = 2; i < nodeArgs.length; i++) {
  if (i > 2 && i < nodeArgs.length) {
    movieName = movieName + "+" + nodeArgs[i];
  }
  else {
    movieName += nodeArgs[i];
  }
}



doNext(userCommand,title);

function doNext(Command, Title){
	switch(Command){
	case 'my-tweets':
		fetchTwitter();
	break;

	case "spotify-this-song":
		fetchSpotify(Title);
	break;

	case "movie-this":
		fetchOMDB(Title);
	break;

	case "do-what-it-says":
		fetchRandom();
	break;

	default:
	break;
	}
}

function fetchTwitter(){
	var tweetsLength;

	
	var params = {screen_name: 'BrianRamaswami'};
	client.get('statuses/user_timeline', function(error, tweets, response) {
		if(error) throw error;


		tweetsLength = 0;

		for(var i=0; i<tweets.length; i++){
			tweetsLength ++;
		}
		if (tweetsLength > 20){
			tweetsLength = 20;
		}
		for (var i=0; i<tweetsLength; i++){
			console.log("Tweet " + (i+1) + " created on: " + tweets[i].created_at);
			console.log("Tweet " + (i+1) + " text: " + tweets[i].text);
			console.log("--------------------------------------------------------------");

			appendFile("Tweet " + (i+1) + " created on: " + tweets[i].created_at);
			appendFile("Tweet " + (i+1) + " text: " + tweets[i].text);
			appendFile("--------------------------------------------------------------");
		}
	});
}

function upperCase (string){
	//Capitalize first letter of each part of song name
	return string.toUpperCase();
}
function titleCase(string){
	var firstLetter = /(^|\s)[a-z]/g;
	return string.replace(firstLetter, upperCase);
}

function fetchSpotify(song){
	var songName;

	//If a song WAS chosen, make it title case so spotify can find it in its database
	//If a song was not typed it, default to the song The Sign
	if (song != null){
		songName = titleCase(song);
	}
	else {
		songName = "The Sign";
	}
	console.log("Searching for: " + songName);
	console.log("------------------------");

	appendFile("Searching for: " + songName);
	appendFile("---------------------------------");

	//Get data from spotify API based on the query term (song name) typed in by the user
	spotify.search({ type: 'track', query: songName}, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
		// console.log(data.tracks[0]);
	    var matchedTracks = [];
	    var dataItems = data.tracks.items;
		console.log(JSON.parse(dataItems));
		console.log(JSON.parse(data));

	    for (var i=0; i<20; i++){
	    	if (data.tracks.items[i].name == songName){
	    		matchedTracks.push(i);
	    	}
	    }

	    console.log(matchedTracks.length + " tracks found that match your query.");
	    appendFile(matchedTracks.length + " tracks found that match your query.");

	    if (matchedTracks.length > 0){
    		console.log("Track: " + dataItems[matchedTracks[0]].name);	
			console.log("Artist: " + dataItems[matchedTracks[0]].artists[0].name);
			console.log("Album: " + dataItems[matchedTracks[0]].album.name);
			console.log("Spotify link: " + dataItems[matchedTracks[0]].external_urls.spotify);

			appendFile("Track: " + dataItems[matchedTracks[0]].name);
			appendFile("Artist: " + dataItems[matchedTracks[0]].artists[0].name);
			appendFile("Album: " + dataItems[matchedTracks[0]].album.name);
			appendFile("Spotify link: " + dataItems[matchedTracks[0]].external_urls.spotify);
		}
		else if (matchedTracks.length == 0){
			console.log("Sorry, but spotify does not contain that song in their database :(");
			appendFile("Sorry, but spotify does not contain that song in their database :(");
		}
		
	});
}

function fetchOMDB(movieName){
	//If a movie was not typed it, default to the movie Mr. Nobody
	if (title == null){
		movieName = "Mr. Nobody";
	}

	var requestURL = "http://www.omdbapi.com/?apikey=2d76dff6&t=" + movieName + "&tomatoes=true&y=&plot=short&r=json";

	request(requestURL, function (error, response, data){

		//200 response means that the page has been found and a response was received.
		if (!error && response.statusCode == 200){
			console.log("Everything working fine.");
		}
		console.log("---------------------------------------------");
		console.log("The movie's title is: " + JSON.parse(data)["Title"]);
		console.log("The movie's release year is: " + JSON.parse(data)["Year"]);		
		console.log("The movie's rating is: " + JSON.parse(data)["imdbRating"]);
		console.log("The movie's was produced in: " + JSON.parse(data)["Country"]);
		console.log("The movie's language is: " + JSON.parse(data)["Language"]);
		console.log("The movie's plot: " + JSON.parse(data)["Plot"]);
		console.log("The movie's actors: " + JSON.parse(data)["Actors"]);
		console.log("The movie's Rotten Tomatoes Rating: " + JSON.parse(data)["tomatoRating"]);
		console.log("The movie's Rotten Tomatoes URL: " + JSON.parse(data)["tomatoURL"]);

		appendFile("---------------------------------------------");
		appendFile("The movie's title is: " + JSON.parse(data)["Title"]);
		appendFile("The movie's release year is: " + JSON.parse(data)["Year"]);		
		appendFile("The movie's rating is: " + JSON.parse(data)["imdbRating"]);
		appendFile("The movie's was produced in: " + JSON.parse(data)["Country"]);
		appendFile("The movie's language is: " + JSON.parse(data)["Language"]);
		appendFile("The movie's plot: " + JSON.parse(data)["Plot"]);
		appendFile("The movie's actors: " + JSON.parse(data)["Actors"]);
		appendFile("The movie's Rotten Tomatoes Rating: " + JSON.parse(data)["tomatoRating"]);
		appendFile("The movie's Rotten Tomatoes URL: " + JSON.parse(data)["tomatoURL"]);											
	});
}

function fetchRandom(){
	//LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
	//Runs `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
	fs.readFile("random.txt", 'utf8', function(err, data){

		// console.log(data);

		//Creating an array from a string with split()
		//Every comma, push the element into the array
		var dataArr = data.split(',');

		// console.log(dataArr);

		var randomUserCommand = dataArr[0];
		var randomtitle = dataArr[1];

		console.log("You requested to " + "<" + randomUserCommand + "> with " + randomtitle);
		appendFile("You requested to " + "<" + randomUserCommand + "> with " + randomtitle);

		//Remove the quotes before making a request
		randomtitle = randomtitle.replace(/^"(.*)"$/, '$1');

		doNext(randomUserCommand, randomtitle);
	});
}

function appendFile(dataToAppend){

	//Output all that happens into a log.txt file
	fs.appendFile("log.txt", dataToAppend , function(err){

		//If an error happens while trying to write to the file
		if (err){
			return console.log(err);
		}
	});
}