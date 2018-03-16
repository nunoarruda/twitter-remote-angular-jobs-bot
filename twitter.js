const Twitter = require('twitter');
const admin = require('firebase-admin');
const serviceAccount = require('./twitter-jobs-firebase-adminsdk-es2pt-19d4de42f6.json');

const client = new Twitter({
    consumer_key: 'EfeqfcYZ0hH5YsWPar8LCYJ1f',
    consumer_secret: 'O5IhScH1XRd3ecqaSVcdM76ugsjkJl3UOrLCsin60tgnbIyVjm',
    access_token_key: '258542343-Y4Mg64VKXgDBfkfHVfhPom3am0AGmMupi26v5dUa',
    access_token_secret: 'CkICReeLh3ocUnOnFWTJr3FAQZdSPMYkVsHceBGlFqGDn'
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

var query_part1 = 'angular,angularjs,angular.js';
var query_part2 = /\b(development|engineering|developers|artist|developer|artists|expert|ninja|engineer|experts|hacker|guru|architects|engineers|specialist|consultants|consultant|dev|architect|samurai|wizard|specialists|artisan|producer|programmer|rockstar|hackers|wizards|artisans|ninjas|coder|programmers|gurus|devs|coders|rockstars|samurais)\b/i;
var query_part3 = /\b(home|virtual|remote|worldwide|distributed|anywhere|remotely|telecommuting|telecommute|telework|wfh|teleworking|telecommuters|telecommuter|teleworkers|teleworker)\b/i;
 
var stream = client.stream('statuses/filter', {track: query_part1});

console.log('Waiting for tweets...');

stream.on('data', function(data) {
    if (match(data.text)) {
        console.log('Tweet: ' + data.text);
        save_to_db(data);
    }
});
 
stream.on('error', function(error) {
    throw error;
});

function match(tweet) {
    return query_part2.test(tweet) && query_part3.test(tweet) && !/^RT @/i.test(tweet);
};

var save_to_db = function(data) {
    var obj = {
        created_at: new Date(data.created_at),
        id_str: data.id_str,
        text: data.text,
        name: data.user.name,
        screen_name: data.user.screen_name
    };

    db.collection('tweets').add(obj).then(() => {
        console.log('Data saved successfully.');
    }).catch(error => {
        console.log('Data could not be saved.' + error);
    });
};
