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
  name: "IELanding",
  components: {
    LessonCard,
  },
  data() {
    return {
      names: ["Lesson 7", "Lesson 8", "Lesson 9"],
      description: ["", "", ""],
      route: ["IE", "IE", "IE"],
      routeParams: [
        {
          name: "IE: Lesson 7",
          userID: "oele",
          projectName: "cmise-project-lesson7-manipulate",
          source: "https://editor.c2stem.org",
        },
        {
          name: "IE: Lesson 8",
          userID: "oele",
          projectName: "cmise-project-lesson8-manipulate",
          source: "https://editor.c2stem.org",
        },
        {
          name: "IE: Lesson 9",
          userID: "oele",
          projectName: "cmise-project-lesson8-manipulate", //currently changing this to the same project as lesson 8 so that students can continue thier work in lesson 9.
          source: "https://editor.c2stem.org",
        },
      ],
      engineering: false,
    };
  },
};
</script>
