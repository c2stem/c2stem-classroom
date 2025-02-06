<template>
  <lesson-card
    :lessonNames="names"
    :description="description"
    :route="route"
    :engineering="engineering"
  ></lesson-card>
</template>

<script>
import LessonCard from "../../components/LessonCard.vue";
import LiveKit from "../../services/LiveKit";
export default {
  name: "SpiceLanding",
  components: {
    LessonCard,
  },
  data() {
    return {
      names: [
        "Science Lesson",
        "Lesson 7",
        "Computational Model",
        "Engineering Design",
      ],
      description: [
        "",
        "",
        "Complete your computational model lessons",
        "Complete your engineering design lessons",
      ],
      route: ["EDMap", "EELanding", "Construct", "Engineering"],
      engineering: false,
    };
  },
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
