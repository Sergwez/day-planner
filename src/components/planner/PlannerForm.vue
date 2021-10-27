<template lang="pug">
.planner__form(@keyup.enter="buttonAction()")
    input.planner__form-time(placeholder="00:00" @input="setTime()" v-model="eventTime" :class="timeIsValid ? 'valid' : ''")
    input.planner__form-text(placeholder="text" v-model="evenText" :class="evenText ? 'valid' : ''")
    button.planner__form-add(@click="buttonAction()"  :disabled="!timeIsValid || !evenText")
      svg.icon.icon-add
        use(xlink:href="@/assets/icons/add.svg")
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {mapGetters, mapActions} from 'vuex'

export default defineComponent ({
  props:{
    action:String,
    event: Object,
  },
  data(){
    return{
      eventId:  this.event ? this.event.id: '',
      eventTime:  this.event ? this.event.time: '',
      evenText: this.event ? this.event.text: '',
      timeIsValid: false,
    }
  },
   computed: {
    ...mapGetters(['getSelectedDay']),
  },
  methods:  {
    ...mapActions(['addEvents', 'sortEvents', 'changeEvents']),
    setTime(){
      //валидация формы
      const regexp = new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')
      if(this.eventTime){
        this.timeIsValid = regexp.test(this.eventTime)
      }else{
        this.timeIsValid = false
      }
    },
    buttonAction(){     
      switch (this.action) {
        case 'change':
          this.changeCurrentEvents().then(this.sortEvents)          
          break
        case 'add':
          this.addNewEvents().then(this.sortEvents)
          break
      }
    },
    async addNewEvents(){
      const data = [this.eventTime, this.evenText]
      this.addEvents(data)
      return true
    },
    async changeCurrentEvents(){
      const data = [this.eventId, this.eventTime, this.evenText]
      this.changeEvents(data)
      return true
    }
  },
  mounted(){
    if(this.action === "change"){
      this.timeIsValid = true
    }
  }
})
</script>

<style scoped lang="scss">
@import "~@/assets/scss/vars.scss";
.planner__form{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 40px;
  margin-top: 20px;
  &-time, &-text{
    font-family:  Noto Sans;
    border-radius: 4px;
    border: 1px solid $light;
    margin-right: 10px;
    padding-left: 8px;
    outline: none;
    color: $black;
    font-size: 16px;
    &.valid{
      border: 1px solid $green;
    }
  }
  &-time{
    width: 80px;
    padding-left: 18px;
  }
  &-text{
    width: 200px;
  }
  &-add{
    width: 40px;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: $blue;
    border-radius: 4px;
    cursor: pointer;
    transition: .3s;
    border: none;
    &:hover{
      background: rgba($blue, 0.8);
    }
    &:disabled{
      background: rgba($blue, 0.3);
    }
    .icon.icon-add{
      width: 16px;
      height: 16px;
      fill: #fff;
    }
  }
}
</style>
