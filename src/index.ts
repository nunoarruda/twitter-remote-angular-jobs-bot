import * as Twitter from "twitter";
import * as admin from "firebase-admin";
import * as serviceAccount from "./twitter-jobs-firebase-adminsdk-es2pt-19d4de42f6.json";

const client = new Twitter({
  consumer_key: "EfeqfcYZ0hH5YsWPar8LCYJ1f",
  consumer_secret: "O5IhScH1XRd3ecqaSVcdM76ugsjkJl3UOrLCsin60tgnbIyVjm",
  access_token_key: "258542343-Y4Mg64VKXgDBfkfHVfhPom3am0AGmMupi26v5dUa",
  access_token_secret: "CkICReeLh3ocUnOnFWTJr3FAQZdSPMYkVsHceBGlFqGDn"
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const queryPart1 = "angular,angularjs,angular.js";
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

stream.on("error", function(error) {
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

  db.collection("tweets")
    .add(obj)
    .then(() => console.log("Tweet data saved successfully."))
    .catch(error => console.error("Tweet data could not be saved.", error));
}
