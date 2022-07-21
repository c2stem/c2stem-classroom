<template>
  <div class="start-panel">
    <button type="button" class="btn btn-success" @click="runModel">
      <i class="bi bi-flag-fill"> Run Simuation</i>
    </button>
  </div>
</template>

<script>
import simulation from "../services/Simulation";
export default {
    name: "Simulation Panel",
    methods:{
        runModel(event){
            simulation.runProject(event);
        }
    }
}
</script>

<style scoped>
.start-panel{
  height: auto;
  margin: 2px 10px 1px 10px;
}
</style>