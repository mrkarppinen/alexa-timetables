
const ListService = require('./service/listService');
const TimetableService = require('./service/timetableService');

exports.getData = (token, lms, msg, errorMsg, listName) => {
                    
    try {
        const listService = new ListService(lms);
        const timetableService = new TimetableService();

        return listService.getListByName(token, listName)
        .then( (list) => {
            if (list != null && list.items.length > 0){
                let stopId = list.items[0].value;
                return timetableService.getTimeTableAsFormatted(stopId, msg);
            }
            return Promise.resolve(errorMsg);
        })

    }catch(e){
        console.error("Exception:" + e);
    }
    return Promise.resolve(errorMsg);
};