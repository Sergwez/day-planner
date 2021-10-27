<template lang="pug">
.planner
  PlannerEvents
  PlannerDays
</template>

<script lang="ts">
import {defineComponent} from "vue";
import PlannerEvents from './PlannerEvents.vue';
import PlannerDays from './PlannerDays.vue';
import {mapActions} from 'vuex'

export default defineComponent ({
  components: {
    PlannerEvents,
    PlannerDays
  },
  methods:{
    ...mapActions(['firstLoad', 'setSelectedDay']),
  },
  mounted(){
    this.firstLoad()
    let currentDate = new Date
    this.setSelectedDay(currentDate.getDay())
  }
})
</script>

<style scoped lang="scss">
.planner {
  height: 100vh;
  max-height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #EFF6FD;
}
</style>
