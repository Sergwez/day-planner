<template lang="pug">
.planner-days
  .planner-days__item(
    v-for="(day, index) in days" 
    @drop='copyEvents(index)' 
    @dragover.prevent
    @dragenter.prevent
    @click="selectDay(index)" 
    :key="day"
   
    :class = "getSelectedDay === index + 1 ? 'active' : ''"
    ) {{day}}
</template>

<script lang="ts">
import {mapActions, mapGetters} from 'vuex'
import {defineComponent} from "vue";

export default defineComponent ({
  data (){
    return{
      days:[
        "пн",
        "вт",
        "ср",
        "чт",
        "пт",
        "сб",
        "вс",
      ],
      activeDay: 0
    }
  },
  methods:{ 
    ...mapActions(['setSelectedDay', 'copyEvents']),

    //получение выбранного дня при клике на день недели (начало недели с воскресенья) и отправка в стор
    selectDay(day:number){
      this.activeDay = day
      if(this.activeDay < 6){
        this.activeDay = day+1
      } else{
        this.activeDay = 7
      }
      this.setSelectedDay(this.activeDay)
    },
  },
  computed:{
    ...mapGetters(['getSelectedDay'])
  },
  
  created(){
    let date = new Date()
     console.log(this.activeDay)
    this.activeDay = date.getDay()
   
  }
})
</script>

<style scoped lang="scss">
.planner-days{
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  margin-left: 58px;
  &__item{
    height: 32px;
    padding: 0 49px 0 50px;
    font-weight: 600;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    &.active{
      background: #F8F8F9;
    }
  }
  .icon{
    fill: black
  }
}
</style>
