<template>
<!-- An example landing page for demo -->
<!-- TODO: REMOVE THIS WHEN CODE CLEANED UP -->
  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Lesson Seven</h5>
          <p class="card-text">
            Computational Modeling
          </p>
            <a href="/explore/lesson-seven" class="btn btn-primary">Continue</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Lesson Eight</h5>
          <p class="card-text">
            Computational Modeling
          </p>
          <a href="/explore/lesson-eight" class="btn btn-primary">Continue</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Lesson Nine</h5>
          <p class="card-text">
            Computational Modeling
          </p>
          <a href="/explore/lesson-nine" class="btn btn-primary">Continue</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Lessons Ten to Twelve</h5>
          <p class="card-text">
            Engineering Design
          </p>
          <a href="/engineering" class="btn btn-primary">Continue</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: { 
    ...mapState(['cmise_group']),
  }
};
</script>

<style scoped>
.card{
    height: fit-content;
    margin: 20px;
}
div{
    min-height: 0;
}
</style>