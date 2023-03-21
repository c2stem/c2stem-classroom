<template>
  <lesson-card
    :lessonNames="names"
    :description="description"
    :route="route"
    :engineering="engineering"
  ></lesson-card>
</template>

<script>
import LessonCard from "../components/LessonCard.vue";
export default {
  name: "Landing",
  components: {
    LessonCard,
  },
  data() {
    return {
      names: ["Computational Model", "IE", "EE" ],
      description: ["Complete your computational model lessons", "Complete your IE model lessons", "Complete your EE design lessons"],
      route: ["Construct", "IELanding", "EELanding"],
      engineering: true,
    };
  },
};
</script>
