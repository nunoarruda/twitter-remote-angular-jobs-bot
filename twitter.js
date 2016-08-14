var Twitter = require('twitter');
var firebase = require('firebase');
 
var client = new Twitter({
    consumer_key: 'EfeqfcYZ0hH5YsWPar8LCYJ1f',
    consumer_secret: 'O5IhScH1XRd3ecqaSVcdM76ugsjkJl3UOrLCsin60tgnbIyVjm',
    access_token_key: '258542343-Y4Mg64VKXgDBfkfHVfhPom3am0AGmMupi26v5dUa',
    access_token_secret: 'CkICReeLh3ocUnOnFWTJr3FAQZdSPMYkVsHceBGlFqGDn'
});

// Initialize the app with no authentication
firebase.initializeApp({
    databaseURL: 'https://twitter-jobs.firebaseio.com'
});

// The app only has access to public data as defined in the Security Rules
var db = firebase.database();
var ref = db.ref('/');

var query_part1 = /\b(css|ui|html|html5|bootstrap|ux|front-end|front end|javascript|js|interactive|interface|interaction|css3|sass|web application|experience|web app|frontend|mobile web|web content|fed|web applications|html 5|css 3|jquery|typescript|angular|angularjs|ionic|phonegap|cordova|hybrid|theme|client-side|client side)\b/i;
var query_part2 = /\b(engineer|developer|expert|specialist|experts|guru|architects|dev|engineers|developers|ninja|architect|specialists|wizard|samurai|programmer|wizards|ninjas|programmers|coder|gurus|devs|coders|samurais|hacker|hackers|rockstar|rockstars|consultant|consultants|development)\b/i;
var query_part3 = 'home,virtual,worldwide,remote,distributed,anywhere,remotely,telecommuting,telecommute,telework,wfh,teleworking,telecommuters,telecommuter,teleworker,teleworkers';
 
var stream = client.stream('statuses/filter', {track: query_part3});

console.log('Waiting for tweets...');

stream.on('data', function(data) {
    var tweet = data.text;

    if (match(tweet)) {
        console.log('Tweet: ' + tweet);
        save_to_db(tweet);
    }
});
 
stream.on('error', function(error) {
    throw error;
});

var match = function(tweet) {
    if (query_part1.test(tweet) && query_part2.test(tweet)) {
        return true;
    } else {
        return false;
    }
};

var save_to_db = function(data) {
    ref.push(data, function(error) {
        if (error) {
            console.log('Data could not be saved.' + error);
        } else {
            console.log('Data saved successfully.');
        }
    });
};
