
'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined; 

const handlers = require('./lib/handlers').handlers;

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Next tram',
            HELP_MESSAGE: '',
            HELP_REPROMPT: '',
            STOP_MESSAGE: 'Goodbye!',
            CHECK_SETTINGS_MESSAGE: 'Not able to read your timetable configuration.',
            CHECK_CONF_MESSAGE:'Check your configurations for timetable.',
            NEXT_MESSAGE: 'From {title}, line {line1.title} will leave at {line1.hour} {line1.minute}, after that next is line {line2.title} at {line2.hour} {line2.minute}',
            FOLLOWING_MESSAGE: 'You\'re following stop {title}',
            TIMETO_MESSAGE: 'From {title}, line {line1.title} will leave in {line1.diff} minutes, after that next line {line2.title} leaves in {line2.diff} minutes',
        },
    }

};



exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

