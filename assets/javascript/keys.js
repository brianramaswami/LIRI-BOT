exports.twitterKeys = {
  consumer_key: 'q31weYJtUbdr7n8rG59sjOCSB',
  consumer_secret: 'qu08evqcR6xKNGvBdQIRses5G9riBWJGYYAnSHmT0u5Xb40k5V',
  access_token_key: '942151771-sP6UrQeFNUyTDl1ZkfoOhQfGGdqX2Can56GOb7Bk',
  access_token_secret: 'Z17jNAv3N3dYh9urjh93n2HtrNNJLEHiubWcjyKAzbgPM',
}

var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});
 
var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});