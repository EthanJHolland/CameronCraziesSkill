/*
references
sdk https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs
speechcons https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
ssml -  (say things softly, quickly, with emphasis, use audio clips, etc)
*/

var Alexa = require('alexa-sdk');

var baseURL="https://s3.amazonaws.com/ccalexa/";

var languageStrings = {
    'en': {
        'translation': {
            'WELCOME' : "Welcome to Cameron Crazies and go Duke!",
            'HELP'    : "If you don't know what to say, try give me a fact, cheer, <say-as interpret-as='spell-out'>UNC</say-as>, or coach k",
            'ABOUT'   : "Cameron Crazies turns Alexa into a duke basketball fan",
            'STOP'    : "Goodbye and <emphasis>go duke</emphasis>!"
        }
    }
};

//Skill Code 
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};


var handlers = {
    'LaunchRequest': function () {
        var say = this.t('WELCOME');
        var noresponse=this.t('HELP');
        var card="fun fact\n"+"coach k\n"+"cheer\n"+"defense\n"+"unc\n"+"nc state"
        this.emit(':askWithCard', say, noresponse, "sample requests", card);
    },

    'AboutIntent': function () {
        var say = this.t('ABOUT');
        sayWithRandImage(this, say);
    },

    'AMAZON.NoIntent': function () {
        this.emit('AMAZON.StopIntent');
    },
    
    'AMAZON.HelpIntent': function () {
        var say=this.t('HELP');
        sayWithRandImage(this, say);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':ask', this.t('STOP'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':ask', this.t('STOP'));
    },

    //custom intents
    'FactIntent': function () {
        var say = randElem(factResponses);
        sayWithRandImage(this, say);
    },

    'OffenseIntent': function(){
        var say = randElem(offenseResponses);
        sayWithRandImage(this, say);
    },

    'DefenseIntent': function(){
        var say = randElem(defenseResponses);
        sayWithRandImage(this, say);
    },

    'CoachKIntent': function(){
        var say = randElem(coachkResponses);
        var source = "https://upload.wikimedia.org/wikipedia/commons/c/c0/20131203_Mike_Krzyzewski.jpg";
        sayWithImage(this, say, "ck1.jpg", source);
    },

    'UNCIntent': function(){
        var say = randElem(uncResponses);
        sayWithRandImage(this, say);
    },

    'NCStateIntent': function(){
        var say = randElem(ncstateResponses);
        sayWithRandImage(this, say);
    },

    'FoulOutIntent': function(){
        var say = randElem(foulOutResponses);
        sayWithRandImage(this, say);
    },
};

//arrays
var factResponses=[
    "The last Duke-UNC game in which neither team was ranked was in 1955",
    "Cameron indoor has a capacity of 9,314 people",
    "Cameron Indoor Stadium opened on <say-as interpret-as=\"date\">19400106</say-as>",
    "The noise in Cameron Indoor stadium has been recorded as high as 121 <phoneme alphabet=\"ipa\" ph=\"ˈdɛsɪbəls\">decibels</phoneme>, louder than a jackhammer",
    "Since 1997 Duke has won 94% of their home games"
];

var offenseResponses=[
    "here we go devils, here we go",
    "let's go duke",
    "go, devils, go",
    "let's go devils"
];

var defenseResponses=[
    "<prosody volume=\"+4dB\" rate=\"20%\" pitch=\"+20%\">oh</prosody>"
];

var foulOutResponses=[
    "<prosody volume=\"+1dB\" rate=\"20%\" pitch=\"+20%\">oh</prosody>. <prosody volume=\"+2dB\" rate=\"60%\" pitch=\"-23%\">SEE</prosody><prosody volume=\"+4dB\" rate=\"160%\" pitch=\"+33%\">YA!</prosody>"
]

var coachkResponses=[
    "<prosody volume=\"+3dB\" rate=\"80%\" pitch=\"-20%\">did you mean goat?</prosody>",
    "<p>Coach K.</p> Part of speech: noun. Definition: the greatest ever",
    "<audio src=\"https://s3.amazonaws.com/ccalexa/goat.mp3\"/>"
];

var uncResponses=[
    "<say-as interpret-as='spell-out'>GTHC</say-as>",
    "go to hell carolina, go to hell"
];

var ncstateResponses=[
    "never heard of them",
    "I'm sorry, I only know relevant information"
];

var sources=[
    "https://commons.wikimedia.org/wiki/File:20131203_Cameron_Crazies.jpg",
    "https://commons.wikimedia.org/wiki/File:Defense.gov_photo_essay_120112-D-VO565-015.jpg",
    "https://commons.wikimedia.org/wiki/File:Duke_basketball_game_at_Cameron_Indoor_Stadium_(2_December_2010).jpg",
    "https://commons.wikimedia.org/wiki/File:CameronIndoor.jpg",
    "https://www.flickr.com/photos/dukeyearlook/6837519085/"
];

//methods
function randElem(array) {
    return(array[Math.floor(Math.random() * array.length)]);
}

function say(say){
     //if they don't say something else in the specified amount of time say . to give them more time
    this.emit(':ask', say, ".");
}

function sayWithImage(handler, say, image, source, noresponse="."){
    var imgObj={
        smallImageUrl: baseURL+image,
        largeImageUrl: baseURL+image
    };
    //this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
    handler.emit(':askWithCard', say, noresponse, "cameron crazies", "source: "+source, imgObj)
}

function sayWithRandImage(handler, say, noresponse="."){
    let rand=Math.floor(Math.random() * sources.length);
    sayWithImage(handler, say, "img"+(rand+1)+".jpg", sources[rand], noresponse);
}