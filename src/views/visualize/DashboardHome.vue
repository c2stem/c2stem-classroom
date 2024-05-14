<template>
  <div class="container text-center dash">
    <div class="row">
      <div class="col-2 dashNavigation">
        <h3>Dashboard</h3>
        <nav class="nav flex-column pt-5">
          <button
            type="button"
            class="btn btn-lg mb-3"
            :class="{ active: isUserActive }"
            @click="$router.push('/dashboard')"
          >
            Users
          </button>
          <button
            type="button"
            class="btn btn-lg mb-3"
            :class="{ active: isProjectActive }"
            @click="$router.push('/dashboard/projects')"
          >
            User Projects
          </button>
        </nav>
      </div>
      <div class="col">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "DashboardHome",
  computed: {
    isUserActive() {
      return this.$route.name === "DashboardUsers";
    },
    isProjectActive() {
      return this.$route.name === "DashboardProjects";
    },
  },
};
</script>
<style scoped>
.dash {
  max-width: 100% !important;
  margin: 0;
  padding: 0;
}
.dashNavigation {
  overflow: auto;
  background-color: thistle;
  border: #615195 outset 3px;
}
.btn:hover {
  background-color: #cdb6f2;
}
</style>
