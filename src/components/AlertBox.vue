<template>
  <div
    class="alert alert-warning alert-dismissible fade show alertBox"
    role="alert"
    id="alertID"
  >
    <p id="alertText">{{ alertMessage }}</p>
    <button
      type="button"
      class="btn-close"
      aria-label="Close"
      @click="closeAlert"
    ></button>
  </div>
</template>
<script>
export default {
  name: "AlertBox",
  data() {
    return {
      cardActive: true,
      alertMessage: this.message,
    };
  },
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  methods: {
    closeAlert() {
      document.getElementById("alertID").style.display = "none";
      this.emitter.emit("close-alert");
    },
  },
};
</script>
<style scoped>
.alertBox {
  width: 30%;
  height: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}
</style>
