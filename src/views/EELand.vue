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
        names: ["Lesson 7", "Lesson 8", "Lesson 9" ],
        description: [ "", "", ""],
        route: ["EE", "EE", "EE"],
        routeParams: [
          {
          userID: "oele",
          projectName: "cmise-project-lesson7-explore",
          source: "https://editor.c2stem.org",
        },
        {
          userID: "oele",
          projectName: "cmise-project-lesson8-explore",
          source: "https://editor.c2stem.org",
        },
        {
          userID: "oele",
          projectName: "cmise-project-lesson9-explore",
          source: "https://editor.c2stem.org",
        }
        ],
        engineering: false,
      };
    },
  };
  </script>