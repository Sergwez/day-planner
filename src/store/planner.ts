
import IEvents from '../models/plannerEvents';
import IState from '../models/plannerState';
import {createId} from "../helpers/planner";

export default({
    actions: {
        //при первой загрузке берем задачи из localstorage, если они есть
        // eslint-disable-next-line
        firstLoad(ctx: any){
            // localStorage.clear()
            const getEvents = localStorage.getItem('planerEvents') || '[]'
            const allEvents = JSON.parse(getEvents);
            if(allEvents && allEvents.length > 0){
                allEvents.forEach(el => el.date = new Date(el.date));
            }
            ctx.dispatch('setEvents', allEvents)
            ctx.dispatch('sortEvents', allEvents)
        },

        // перезаписываем задачи. Все операции с задачами (добавление, удаление, копирование) происходит через этот экшен
        // eslint-disable-next-line
        setEvents(ctx: any, events:Array<IEvents>){
            localStorage.setItem('planerEvents', JSON.stringify(events));
            ctx.commit('updateEvents', events) 
        },

        //выбранный день недели
        // eslint-disable-next-line
        setSelectedDay(ctx: any, day:number):void{
            if(day === 0){
                day = 7
            }
            ctx.commit('updateSelectedDay', day) 
        },

        //формирование массива задач с вновьдобавленной задачей
        // eslint-disable-next-line
        addEvents(ctx: any, data:Array<string>):void{
            const newTime:Array<number> = data[0].split(":").map(parseFloat)
            const currentEvents:Array<IEvents> = ctx.getters.allEvents
            let events:Array<IEvents> = currentEvents.map(obj => ({...obj}))
            const newDate = new Date()
            newDate.setDate(newDate.getDate() - (newDate.getDay() - ctx.getters.getSelectedDay))
            newDate.setHours(newTime[0], newTime[1])
                const id = createId(events)
                const newEvents:IEvents = {
                    id,
                    date: newDate,
                    text: data[1]
                }
                events = [...events, newEvents]
            ctx.dispatch('setEvents', events)
        },

        //формирование массива задач без удаленной задачи
        // eslint-disable-next-line
        deleteEvents(ctx: any, id: IEvents):void{
            const events:Array<IEvents> = ctx.getters.allEvents.filter(elem => elem.id != id)
            ctx.dispatch('setEvents', events)
        },

        //формирование массива задач с измененой задачей
        // eslint-disable-next-line
        changeEvents(ctx: any, data: Array<string>):void{
            const newTime:Array<number> = data[1].split(":").map(parseFloat)
            const currentEvents:Array<IEvents> = ctx.getters.allEvents
            const events:Array<IEvents> = currentEvents.map(obj => ({...obj}))
            const newDate = new Date()
            newDate.setDate(newDate.getDate() - (newDate.getDay() - ctx.getters.getSelectedDay))
            newDate.setHours(newTime[0], newTime[1])
            const id:number = +data[0]
            events.forEach(elem => {
                if(elem.id === id){
                    elem.date = newDate
                    elem.text = data[2]
                }
            })
            ctx.dispatch('setEvents', events)
        },

        //сортировка задач
        // eslint-disable-next-line
        sortEvents(ctx: any):void{
            const events:Array<IEvents> = ctx.getters.allEvents
            events.sort((a, b) => (a.date < b.date ? -1 : 1));
            ctx.dispatch('setEvents', events)
        },

        //формирование массивов задач для копирования на новый день
        // eslint-disable-next-line
        copyEvents(ctx: any, index: number):void{
            const copyToDay:number = index+1
            const newDate = new Date()
            ctx.getters.filterEvents.forEach(obj => {
                const newEventDate = new Date(obj.date)
                const newText = obj.text
                newEventDate.setDate(newDate.getDate() - (newDate.getDay() - copyToDay))
                let events:Array<IEvents> = ctx.getters.allEvents.map(obj => ({...obj}))
                const id = createId(events)
                const newEvent = {
                    id,
                    date: newEventDate,
                    text: newText
                }
                events = [...events, newEvent]
                ctx.dispatch('setEvents', events)
            })
        },
    },
    mutations: {
        updateEvents(state:IState, events:Array<IEvents>):void{
            state.events = events
        },
        updateSelectedDay(state:IState, day:number):void{
            state.selectedDay = day
        },
    },
    state: (): IState => ({
        events: Array<IEvents>(),
        selectedDay: 0
    }),
    getters:{
        //получить все задачи
        allEvents(state: IState): Array<IEvents>{ 
            return state.events
        },
        //получить отфильтрованные задачи по текущему дню недели
        filterEvents(state: IState): Array<IEvents>{ 
            const filteredEvents = state.events.filter(elem => {
                if(elem.date.getDay() === 0 && state.selectedDay === 7){
                    return true
                }else{
                    return elem.date.getDay() === state.selectedDay
                }
            })
            return filteredEvents
        },
        //получить выбранный день недели
        getSelectedDay(state: IState): number{ 
            return state.selectedDay
        }
    }
})