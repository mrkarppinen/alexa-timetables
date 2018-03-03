const td = require("testdouble");
const chai = require("chai");
const expect = chai.expect;
const tdChai = require("testdouble-chai");
const fs = require('fs');
const moment = require('moment');

const request = td.replace('request');
const loader = require('../lib/loader'); 



chai.use(tdChai(td)); 


describe('getData', function (){
    let lms;
    let token = '1234';

    before(function (){
        process.env.url = 'www.domain.com';

        let body = fs.readFileSync('./test/resources/timetable.json','utf-8');
        let listJson = JSON.parse(fs.readFileSync('./test/resources/lists.json', 'utf8'));    
        let itemsJson = JSON.parse(fs.readFileSync('./test/resources/items.json', 'utf8')); 


        td.when(request('www.domain.com/1234')).thenCallback(null, {}, body);


        lms = td.object(['getListsMetadata', 'getList']);
        td.when(lms.getListsMetadata(token)).thenResolve(listJson);
        td.when(lms.getList('list_1_id', 'active', token)).thenResolve(itemsJson);

       
    });


    it('should get data', async function (){

        const msg = await loader.getData(token, lms, '{title}', null, 'List 1');
        expect(msg).to.equal('Keskusta');
    });


});