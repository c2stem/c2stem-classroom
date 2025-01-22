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
      names: ["Science Lesson", "Lesson 7", "Computational Model"],
      description: ["", "", "Complete your computational model lessons"],
      route: ["EDMap", "EELanding", "Construct"],
      engineering: true,
    };
  },
};
</script>
