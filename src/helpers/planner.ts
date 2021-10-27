
import IEvents from '../models/plannerEvents';
function createId(events:Array<IEvents>):number{
    if(events.length>0){
        return Math.max(...events.map(elem => elem.id))+1
    }else{
        return 0
    }
}

export {createId};