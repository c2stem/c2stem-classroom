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
};
</script>
