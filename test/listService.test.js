const td = require("testdouble");
const chai = require("chai");
const expect = chai.expect;
const tdChai = require("testdouble-chai");
const fs = require('fs');
const ListService = require('../lib/service/listService');

chai.use(tdChai(td)); 

describe('ListService', function (){

    const token = "1234";
    const listName = "List 1";

    let listService;
    let lms;


    before(function (){

        let listJson = JSON.parse(fs.readFileSync('./test/resources/lists.json', 'utf8'));    
        let itemsJson = JSON.parse(fs.readFileSync('./test/resources/items.json', 'utf8')); 

        
        lms = td.object(['getListsMetadata', 'getList']);
        td.when(lms.getListsMetadata(token)).thenResolve(listJson);
        td.when(lms.getList('list_1_id', 'active', token)).thenResolve(itemsJson);

        listService = new ListService(lms);

    });



    describe('#getListId()', function (){


        it('should return list', async function (){

            const id = await listService.getListId(token, listName);

            expect(id).not.to.be.null;
            expect(id).to.equal('list_1_id');

        });


    });


    describe('#getList()', function(){
         
        it('should return items', async function (){
            
            const list = await listService.getList(token, 'list_1_id');

            expect(list).have.property('listId');
            expect(list.listId).to.equal('list_1_id');
            expect(list.items.length).to.be.above(0);

        });
    });


    describe('#getListByName()', function(){
         
        it('should return items', async function (){
            
            const list = await listService.getListByName(token, 'List 1');

            expect(list).have.property('listId');
            expect(list.listId).to.equal('list_1_id');
            expect(list.items.length).to.be.above(0);

        });
    });


});