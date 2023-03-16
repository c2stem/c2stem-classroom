<template>
  <div class="row">
    <div v-for="(name, index) in lessonNames" :key="index" class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{ name }}</h5>
          <p class="card-text">{{description[index]}}</p>
          <router-link v-if="routeParams" :to="{name: route[index], params: routeParams[index]}"><button type="button" class="btn btn-primary">Continue</button></router-link>
          <router-link v-else :to="{name: route[index]}"><button type="button" class="btn btn-primary">Continue</button></router-link>
        </div>
      </div>
    </div>
    <div v-if="engineering" class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Engineering Design</h5>
          <p class="card-text">Complete your engineering design lessons</p>
          <a href="/engineering" class="btn btn-primary">Continue</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Lesson Card",
  props: {
    lessonNames: {
      type: Array,
      requires: true,
    },
    description: {
      type: Array,
      requires: true,
    },
    route: {
      type: Array,
      requires: true,
    },
    routeParams: {
      type: Object,
    },
    engineering: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
.card{
    height: fit-content;
    margin: 20px;
}
div{
    min-height: 0;
    margin: auto;
    width: max-content;
}
</style>