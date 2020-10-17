<template>
  <div>
    <div is="stat-circle" percentage="percentage"></div>
    <svg class="stat-circle" viewBox="1.6 1.6 16.8 16.8">
      <circle class="bg" cx="10" cy="10" r="8"></circle>
      <circle class="progress" cx="10" cy="10" r="8" :data-percentage="percentage"></circle>
      <text x="62%" y="70%">{{ percentage }}%</text>
    </svg>
  </div>
</template>

<script>
export default {
  name: "StatCircle",
  props:["percentage"],
  data(){
      return{

      }
  }
};
</script>
<style scoped>

.stat-circle {
  width: 75px;
}
.stat-circle circle.bg {
  fill: none;
  stroke: #f1f1f1;
  stroke-width: 0.4;
}
.stat-circle circle.progress {
  fill: none;
  stroke: #ff3a42;
  stroke-width: 0.8;
  stroke-dasharray: 51 51;
  stroke-dashoffset: -51;
  stroke-linecap: round;
}
.stat-circle text {
  font-size: 5px;
  text-anchor: middle;
  fill: #bbb;
}

</style>



