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
  name: "EELanding",
  components: {
    LessonCard,
  },
  data() {
    return {
      names: ["Alicia's model", "Ben's Model"],
      description: ["", ""],
      route: ["EE", "EE"],
      routeParams: [
        {
          name: "Alicia's model",
          userID: "oele",
          projectName: "cmise-project-lesson9-explore",
          source: "https://editor.c2-stem.org",
        },
        {
          name: "Ben's Model",
          userID: "oele",
          projectName: "cmise-project-lesson7-EE-task2",
          source: "https://editor.c2-stem.org",
        },
      ],
      engineering: false,
    };
  },
};
</script>
