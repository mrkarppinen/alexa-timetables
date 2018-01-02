
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const utils = require('./utils.js');


exports.handlers = {
    'LaunchRequest': function () {
        this.emit('GetNextTram');
    },
    'GetNextTramIntent': function () {
        this.emit('GetNextTram');
    },
    'GetNextTram': function () {
        let token;
        try {
         token = this.event.context.System.apiAccessToken;
        }catch (e){}
        if (token){

                let getData = async ( (token) => {
                    const lms = new Alexa.services.ListManagementService();
                    try {
                        let listId = await (utils,getList('Timetable', token, lms));
                        let stop = await (utils.getStop(listId, token, lms));
                        return utils.requestData(stop, this.t('NEXT_MESSAGE'));
                    }catch(e){
                        console.error("Exception:" + e);
                    }
                    return Promise.resolve(this.t('CHECK_CONF_MESSAGE'));
                });

                utils.getData(token)
                .then( (speechOutput)=> {
                    this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), speechOutput);
                });
            
        }else {
            let speechOutput = this.t('CHECK_SETTINGS_MESSAGE');
            this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), speechOutput);
        }
        
    },
    'FollowingStopIntent': function () {
        let token;
        try {
         token = this.event.context.System.apiAccessToken;
        }catch (e){}
        if (token){

                let getData = async ( (token) => {
                    const lms = new Alexa.services.ListManagementService();
                    try {
                        let listId = await (utils.getList('Timetable', token, lms));
                        let stop = await (utils.getStop(listId, token, lms));
                        return utils.requestData(stop, this.t('FOLLOWING_MESSAGE'));
                    }catch(e){
                        console.error("Exception:" + e);
                    }
                    return Promise.resolve(this.t('CHECK_CONF_MESSAGE'));
                });

                utils.getData(token)
                .then( (speechOutput)=> {
                    this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), speechOutput);
                });
            
        }else {
            let speechOutput = this.t('CHECK_SETTINGS_MESSAGE');
            this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), speechOutput);
        }
        
    },
    'TimeToNextIntent': function (){

    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};