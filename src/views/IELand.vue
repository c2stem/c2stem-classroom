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
      names: ["Lesson 7", "Lesson 8", "Lesson 9" ],
      description: [ "Complete your IE model lessons", "Complete your IE design lessons", "Complete your IE model lessons"],
      route: ["IE", "IE", "IE"],
      routeParams: [
        {
        userID: "oele",
        projectName: "cmise-project-lesson7-manipulate",
        source: "https://editor.c2stem.org",
      },
      {
        userID: "oele",
        projectName: "cmise-project-lesson8-manipulate",
        source: "https://editor.c2stem.org",
      },
      {
        userID: "oele",
        projectName: "cmise-project-lesson9-manipulate",
        source: "https://editor.c2stem.org",
      }
      ],
      engineering: false,
    };
  },
};
</script>