import * as Twitter from "twitter";
import * as admin from "firebase-admin";

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });
const tweetsCol = db.collection("tweets");

const queryPart1 = "angular,ionic,nativescript";
const queryPart2 = /\b(development|engineering|developers|artist|developer|artists|expert|ninja|engineer|experts|hacker|guru|architects|engineers|specialist|consultants|consultant|dev|architect|samurai|wizard|specialists|artisan|producer|programmer|rockstar|hackers|wizards|artisans|ninjas|coder|programmers|gurus|devs|coders|rockstars|samurais)\b/i;
const queryPart3 = /\b(home|virtual|remote|worldwide|distributed|anywhere|remotely|telecommuting|telecommute|telework|wfh|teleworking|telecommuters|telecommuter|teleworkers|teleworker)\b/i;

const stream = client.stream("statuses/filter", { track: queryPart1 });
console.log("Tracking tweets...");

stream.on("data", data => {
  if (match(data.text)) {
    console.log(`Tweet matched! -> ${data.text}`);
    saveToDb(data);
  }
});

stream.on("error", error => {
  throw error;
});

function match(tweet) {
  return (
    queryPart2.test(tweet) && queryPart3.test(tweet) && !/^RT @/i.test(tweet)
  );
}

function saveToDb(data) {
  console.log("Saving to database...");
  const obj = {
    created_at: new Date(data.created_at),
    id_str: data.id_str,
    text: data.text,
    name: data.user.name,
    screen_name: data.user.screen_name
  };

  tweetsCol
    .add(obj)
    .then(() => console.log("Tweet data saved successfully."))
    .catch(error => console.error("Tweet data could not be saved.", error));
}
