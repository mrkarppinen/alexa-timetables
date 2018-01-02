 
const request = require('request');
const moment = require('moment');
 
 exports.requestData = (stop, message) => {

    return new Promise( (resolve, reject) => {
           request(`${process.env.url}/${stop}`, (error, response, body) => {

                if (error){
                    console.error(JSON.stringify(error));
                    reject("Not able to find next tram.");
                }else {

                    let timetable = JSON.parse(body);
                    
                    let date = moment().utcOffset(2);
                    let time = ( (date.hour() * 60 ) + date.minutes() ) * 60;

                    let departures = timetable.content.timetable
                    .filter( (item) => {
                        return item.time > time;
                    }).map((item) => ({
                        hour: parseHour(item.time),
                        minute: parseMinute(item.time),
                        lines: item.lines,
                    }));


                    let now = departures[0];
                    let next = departures[1];
                    let msg = message.replace('{title}', timetable.content.title)
                    .replace('{line1.title}', now.lines[0])
                    .replace('{line1.hour}', now.hour)
                    .replace('{line1.minute}', now.minute)
                    .replace('{line2.title}', next.lines[0])
                    .replace('{line2.hour}', next.hour)
                    .replace('{line2.minute}', next.minute)
                    resolve(msg);

                }

           }); 


    });

}


exports.getList = function (listname,token, lms) {
     return lms.getListsMetadata(token).then( (data) =>  {
        let lists = data.lists.filter( (list) => list.name == listname );
        return lists[0].listId;
    } );
}


exports.getStop = function(id,token, lms){
    
    return lms.getList(id, 'active', token)
    .then( (list) =>  {
        return list.items[0].value;
    } );
}


function parseHour(time) {
    let hour = Math.floor(time / 60 / 60);
    hour = (hour >= 24) ? hour-24 : hour;
    return (`0${hour}`).slice(-2);
  }

 function parseMinute(time){
    return (`0${Math.floor((time / 60) % 60)}`).slice(-2);
}