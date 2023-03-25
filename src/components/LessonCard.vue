<template>
  <div class="row">
    <div v-for="(name, index) in lessonNames" :key="index" class=" cardCol col-6 col-xl-3 col-lg-3">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{ name }}</h5>
          <p class="card-text">{{ description[index] }}</p>
          <router-link
            v-if="routeParams"
            :to="{ name: route[index], params: routeParams[index] }"
            ><button type="button" class="btn btn-primary">
              Continue
            </button></router-link
          >
          <router-link v-else :to="{ name: route[index] }"
            ><button type="button" class="btn btn-primary">
              Continue
            </button></router-link
          >
        </div>
      </div>
    </div>
    <div v-if="engineering" class="cardCol col-6 col-xl-3 col-lg-3">
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
.card {
  margin: 20px;
  width: fit-content;
  min-height: fit-content;
}
.card-text{
  display: flex;
  justify-content: flex-start;
}
div {
  min-height: 127px;
  margin: 0;
}
.row {
  height: fit-content;
  justify-content: center;
}
.cardCol{
  width: fit-content;
}
</style>
