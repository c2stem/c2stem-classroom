<template>
  <div id="action-list">
    <p v-bind:key="pt.timestamp" v-for="pt in data">
      {{ pt.type }} - {{ pt.group }} - {{ pt.action }} - {{ pt.ted }} |
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
    };
  },
  mounted() {
    window.addEventListener("storage", () => {
      this.data.splice(0, this.data.length);
      console.log(JSON.parse(window.sessionStorage.getItem("actionList")));
      this.data.push(
        ...JSON.parse(window.sessionStorage.getItem("actionList"))
      );
      this.data.reverse();
    });
  },
};
</script>

<style>
#action-list {
  display: flex;
  flex-direction: row-reverse;
  gap: 10px;
  overflow-x: scroll;
}
</style>
