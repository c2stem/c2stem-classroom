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
  name: "ConstructLanding",
  components: {
    LessonCard,
  },
  data() {
    return {
      names: ["Computational Model"],
      description: ["Complete your computational model lessons"],
      route: ["Construct"],
      engineering: true,
    };
  },
};
</script>
