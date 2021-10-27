<template lang="pug">
.planner-events
  .planner-events__copy(draggable="true")
    svg.icon.icon-star.drag
      use(xlink:href="@/assets/icons/star.svg")
  transition-group(tag="div" :name="useAnimation ? 'flip-list' : ''")
    .planner-events__item(v-for="(event, index) in events()" :key="event.id" :class="event.date < currentDate ? 'past' : ''")
      .planner-events__item-time(v-if="indexShowForm != index" @click="showForm(index)") {{eventTime(event.date.getHours(), event.date.getMinutes())}}
      .planner-events__item-text(v-if="indexShowForm != index" @click="showForm(index)") {{event.text}}
      .planner-events__item-delete(@click="deleteEvent(event.id)" v-if="indexShowForm != index")
        svg.icon.icon-delete
          use(xlink:href="@/assets/icons/delete.svg")  
      PlannerForm.planner-events__form(:action="'change'" :event="changeEvent(event)" v-if="indexShowForm === index")
  PlannerForm(:action="'add'")
</template>

<script lang="ts">

import {defineComponent} from "vue";
import PlannerForm from './PlannerForm.vue';
import {mapGetters, mapActions} from 'vuex'

export default defineComponent ({
 components: {
    PlannerForm
 },
  data(){
    return{
      currentDate: new Date(),
      indexShowForm: -1,
      preventDays: [this.getSelectedDay,-1], //для отключения анимации при переходе между днями
      useAnimation: false
    }
  },
  computed: {
    ...mapGetters([ 'filterEvents', 'getSelectedDay']),
  },
  methods:  {
    ...mapActions(['deleteEvents', 'sortEvents']),
    events(){
      return this.filterEvents
    },
    deleteEvent(id){
      this.deleteEvents(id)
    },
    eventTime(hours, minutes){
      return this.correctionTime(hours)+':'+this.correctionTime(minutes)
    },
    correctionTime(value){
      return ('0'+value).slice(-2)
    },
    showForm(index){
      this.indexShowForm = index
    },
    changeEvent(event){
      return{
        id: event.id,
        time: this.eventTime(event.date.getHours(), event.date.getMinutes()),
        text: event.text,
      }
    }
  },
  watch:{
    filterEvents: function(){
      this.indexShowForm = -1
      this.preventDays.unshift(this.getSelectedDay)
      this.preventDays.splice(-1)
      this.useAnimation = this.preventDays[0] === this.preventDays[1]
    }
  }
})
</script>


<style scoped lang="scss">
@import "~@/assets/scss/vars.scss";
.planner-events{
  display:flex;
  flex-direction: column;
  padding: 26px 30px 30px;
  background: #fff;
  min-height: 250px;
  min-width: 400px;
  border: 1px solid $light;
  border-radius: 8px;
  &__copy{
    height: 23px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-bottom: 46px;
    .icon-star{
      width: 23px;
      height: 23px;
      fill: $black;
      margin-right: 8px;
      &:hover{
        cursor: move;
      }
    }
  }
  &__item{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 32px;
    &-time{
      width:80px;
      text-align: center;
      margin-left: 12px;
      .past>&{
        color: $red;
      }
    }
    &-text{
      width: 100%;
      padding-left:33px;
      .past>&{
        color: $red;
      }
    }
    &-delete{
      margin-right: 6px;
      width: 40px;
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .icon-delete{
        width: 13px;
        height: 13px;
        fill: $gray;
        transition: .3s;
        &:hover{
          fill: $black;
        }
      }
    }
  }
  .planner-events__form{
    margin-bottom: 20px;
  }
  .flip-list-move {
    transition: transform 0.4s ease;
  }
}
</style>
