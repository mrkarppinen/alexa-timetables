
class ListService {

    constructor(listManagementService){
        this.lms = listManagementService;
    }

    getListId(token, listName){
        return this.lms.getListsMetadata(token).then( (data) =>  {
            let lists = data.lists.filter( (list) => list.name == listName );
            return lists[0].listId;
        } );
    }

    getList(token, id){
        return this.lms.getList(id, 'active', token);
    }

    getListByName(token, name){
        return this.getListId(token, name).then( (id) => {
            return this.getList(token, id);
        })
    }

}


module.exports = ListService;