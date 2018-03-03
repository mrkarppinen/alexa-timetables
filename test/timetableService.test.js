const td = require("testdouble");
const chai = require("chai");
const expect = chai.expect;
const tdChai = require("testdouble-chai");
const fs = require('fs');
const moment = require('moment');

const request = td.replace('request');
const TimetableService = require('../lib/service/timetableService');

chai.use(tdChai(td)); 


describe('TimetableService', function (){

    let timetableService;

    before(function (){
        process.env.url = 'www.domain.com';
        let body = fs.readFileSync('./test/resources/timetable.json','utf-8')
        td.when(request('www.domain.com/1234')).thenCallback(null, {}, body);

        timetableService = new TimetableService();
    });


    describe('#getTimetable()', function (){
      
           it('should return departures', async function (){
                const timetable = await timetableService.getTimetable('1234');

                expect(timetable.title).to.equal('Keskusta')
           });

    });


    describe('#getTimetableAsFormatted()', function (){
      
        it('should return departures', async function (){
            let date = moment('2018-01-01T10:56')

             const message = await timetableService.getTimeTableAsFormatted('1234', 'From {title}, line {line1.title} will leave at {line1.hour} {line1.minute}', date);

             expect(message).to.equal('From Keskusta, line 11 will leave at 11 01');

        });

 });


});


