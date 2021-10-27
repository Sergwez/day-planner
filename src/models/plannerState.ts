import IEvents from './plannerEvents';

export default interface IState {
    events: Array<IEvents>,
    selectedDay: number
}