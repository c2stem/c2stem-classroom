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
      names: ["Lesson 6", "Lesson 7", "Lesson 8", "Lesson 9"],
      description: ["", "", "", ""],
      route: ["EE", "EE", "EE", "EE"],
      routeParams: [
        {
          name: "EE: Lesson 6",
          userID: "oele",
          projectName: "cmise-project-lesson6-explore",
          source: "https://editor.c2stem.org",
        },
        {
          name: "EE: Lesson 7",
          userID: "oele",
          projectName: "cmise-project-lesson7-EE-task2",
          source: "https://editor.c2stem.org",
        },
        {
          name: "EE: Lesson 8",
          userID: "oele",
          projectName: "cmise-project-lesson8-explore",
          source: "https://editor.c2stem.org",
        },
        {
          name: "EE: Lesson 9",
          userID: "oele",
          projectName: "cmise-project-lesson9-explore",
          source: "https://editor.c2stem.org",
        },
      ],
      engineering: false,
    };
  },
};
</script>
