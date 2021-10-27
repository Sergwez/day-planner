<template>
  <PlannerMain/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PlannerMain from './components/planner/PlannerMain.vue';

@Options({
  components: {
    PlannerMain,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "~@/assets/fonts/NotoSans/noto.css";
@import "~@/assets/scss/vars.scss";
$black: #323C46;
body{
  margin: 0;
  font-family: Noto Sans;
  font-size: 16px;
  line-height: 22px;
  color: $black;
  *{
    box-sizing: border-box;
  }
}
</style>
