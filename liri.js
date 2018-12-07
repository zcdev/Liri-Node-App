// All require node modules
require("dotenv").config();
var request = require('request');
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
moment().format();

// Node processes
var command = process.argv[2];
var search = process.argv[3];
var query = process.argv;

// Search Helper
function searchHelper() {
    var search = "";
    for (var i = 3; i < query.length; i++) {
        if (i > 3 && i < query.length) {
            search = search + "+" + query[i];
        } else {
            search += query[i];
        }
    }
}

// Spotify
function spotifyThisSong(search) {
    if (search === undefined) {
        search = "The Sign Ace Of Base";
    }

    searchHelper(search);

    spotify.search({ type: 'track', query: search}, function(error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
        console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Link to the song: " + data.tracks.items[0].album.href);
        console.log("Your song is from the " + data.tracks.items[0].album.name + " album");
    });
}

// Bands In Town
function concertThis(search) {

    searchHelper(search);

    request("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp", function(error, response, body) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
        var data = JSON.parse(body);
        for (i=0;i<data.length;i++){
        console.log("Venue" + data[i].venue.name);
        var date = data[i].datetime;
        date = moment(date).format("MM/DD/YYYY");
        console.log("Date: " + date)
        }
    });
}

// Command conditionals
switch (command) {
    case "spotify-this-song":
    spotifyThisSong(search);
    break;
    case  "concert-this":
    concertThis(search);
    break;
    default:
    console.log("Please enter a valid command.");
}