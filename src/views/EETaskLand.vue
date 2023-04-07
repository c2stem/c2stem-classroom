<template>
  <lesson-card
    :lessonNames="names"
    :description="description"
    :route="route"
    :routeParams="routeParams"
    :engineering="engineering"
  >
  </lesson-card>
</template>

<script>
import LessonCard from "../components/LessonCard.vue";
export default {
  name: "EETaskLanding",
  components: {
    LessonCard,
  },
  data() {
    return {
      names: ["Task 1", "Task 2", "Task 3"],
      description: ["", "", ""],
      route: ["EE", "EE", "EE"],
      routeParams: [
        {
          userID: "oele",
          projectName: "cmise-project-lesson7-EE-task1",
          source: "https://editor.c2stem.org",
        },
        {
          userID: "oele",
          projectName: "cmise-project-lesson7-EE-task2",
          source: "https://editor.c2stem.org",
        },
        {
          userID: "oele",
          projectName: "cmise-project-lesson7-EE-task3",
          source: "https://editor.c2stem.org",
        },
      ],
      engineering: false,
    };
  },
};
</script>
