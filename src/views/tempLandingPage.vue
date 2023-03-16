<template>
  <lesson-card
    :lessonNames="names"
    :description="description"
    :route="route"
    :routeParams="routeParams"
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
      names: ["Computational Model", "IE" ],
      description: ["Complete your computational model lessons", "Complete your IE model lessons"],
      route: ["Construct", "IELanding"],
      engineering: true,
    };
  },
};
</script>
