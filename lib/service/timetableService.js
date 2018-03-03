const request = require('request');
const moment = require('moment');

class TimetableService {

    constructor(){}

    getTimetable(stop, date = moment().utcOffset(2)){
        return new Promise( (resolve, reject) => {
          
            request(`${process.env.url}/${stop}`, (error, response, body) => {
           
                 if (error){
                     console.error(JSON.stringify(error));
                     reject("Not able to find next tram.");
                 }else {
 
                     let timetable = JSON.parse(body);
                     let time = ( (date.hour() * 60 ) + date.minutes() ) * 60;
 
                     let departures = timetable.content.timetable
                     .filter( (item) => {
                         return item.time > time;
                     })
                     .splice(0, 2)
                     .map((item) => {
 
                         let hour = this._parseHour(item.time);
                         let minute = this._parseMinute(item.time);
                         let diff = this._calculateDiff(hour, minute, date);
 
                         return {
                             hour: hour,
                             minute: minute,
                             diff: diff,
                             lines: item.lines,
                         };
 
                     });
           
                     resolve({
                         title: timetable.content.title,
                         departures: departures
                     });
 
                 }
 
            }); 
     });

    }

    getTimeTableAsFormatted(stop, message, date){

        return this.getTimetable(stop, date).then( (timetable) => {

            let msg = message.replace('{title}', timetable.title);
 
            timetable.departures.forEach( (departure, index) => {

            msg = msg.replace(`{line${index+1}.title}`, departure.lines[0])
                        .replace(`{line${index+1}.hour}`, departure.hour)
                        .replace(`{line${index+1}.minute}`, departure.minute)
                        .replace(`{line${index+1}.diff}`, departure.diff); 

            });  
            
            return msg;

        });
  
    }


    _parseHour(time) {
        let hour = Math.floor(time / 60 / 60);
        hour = (hour >= 24) ? hour-24 : hour;
        return (`0${hour}`).slice(-2);
      }
    
    _parseMinute(time){
        return (`0${Math.floor((time / 60) % 60)}`).slice(-2);
    }
    
    
    _calculateDiff(hour, minute, compare){
        let time = moment(`${hour}:${minute}`, "HH:mm").utcOffset(2);
        let diff = time.format('x') - compare.format('x');
    
        return Math.round( ( diff / 1000) / 60 );
    }

}


module.exports = TimetableService;