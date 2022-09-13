<template>
<!-- An example landing page for demo -->
  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Explore Group</h5>
          <p class="card-text">
            Explore group Environment
          </p>
          <a href="/explore-menu" class="btn btn-primary" @click="changeGroup('explore')">Continue</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Construct Group</h5>
          <p class="card-text">
            Construct Group Environment
          </p>
          <a href="/construct-menu" class="btn btn-primary" @click="changeGroup('construct')">Continue</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Manipulate Group</h5>
          <p class="card-text">
            Manipulate Group Environment
          </p>
          <a href="/manipulate-menu" class="btn btn-primary" @click="changeGroup('manipulate')">Continue</a>
        </div>
      </div>
    </div>
    <!-- <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Engineering Design</h5>
          <p class="card-text">
            Engineering Design Environment
          </p>
          <a href="/engineering" class="btn btn-primary">Continue</a>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() { 
    return{
      ...mapState(['cmise_groups']),
     }
  },
  methods: {
    ...mapMutations(['changeGroup']),
    changeGroup(newGroup) {
      this.$store.commit('changeGroup', {
        newGroup,
      });
    }
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

