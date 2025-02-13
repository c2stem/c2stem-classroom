<template>
  <img src="../assets/EDMap.jpg" class="img-fluid" alt="..." />
</template>
<script>
import LiveKit from "../services/LiveKit";

export default {
  name: "EDMap",
  computed: {
    getLiveKitRoom() {
      return this.$store.getters.getLiveKitRoom;
    },
  },
  methods: {
    getUser() {
      return sessionStorage.getItem("user");
    },
  },
  async mounted() {
    try {
      let roomLiveKit = this.getLiveKitRoom;
      let localParticipantDevices =
        roomLiveKit.localParticipant.activeDeviceMap.size;
      if (!localParticipantDevices) {
        await LiveKit.tryAndPublish(
          this.getUser().replaceAll('"', ""),
          this.$store
        );
      }
    } catch (e) {
      console.log(e);
    }
  },
};
</script>
<style scoped></style>
