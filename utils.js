 
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
                    })
                    .splice(0, 2)
                    .map((item) => {

                        let hour = parseHour(item.time);
                        let minute = parseMinute(item.time);
                        let diff = calculateDiff(hour, minute, date);

                        return {
                            hour: hour,
                            minute: minute,
                            diff: diff,
                            lines: item.lines,
                        };

                    });

                    let msg = message.replace('{title}', timetable.content.title);

                    departures.forEach( (departure, index) => {

                        msg = msg.replace(`{line${index+1}.title}`, departure.lines[0])
                                 .replace(`{line${index+1}.hour}`, departure.hour)
                                 .replace(`{line${index+1}.minute}`, departure.minute)
                                 .replace(`{line${index+1}.diff}`, departure.diff); 

                    });
          
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


function calculateDiff(hour, minute, compare){
    let time = moment(`${hour}:${minute}`, "HH:mm").utcOffset(2);
    let diff = time.format('x') - compare.format('x');

    return Math.round( ( diff / 1000) / 60 );
}