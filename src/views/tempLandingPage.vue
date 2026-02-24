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
      names: ["Computational Model", "Engineering Gamification"],
      description: [
        "Complete your computational model lessons",
        "Complete your engineering design lessons",
      ],
      route: ["Construct", "EngineeringProject"],
      routeParams: [
        {},
        {
          name: "Engineering Gamification",
          userID: "oele",
          projectName: "cmise-project-engineering-gamification",
          source: "https://editor.c2stem.org",
        },
      ],
      // names: ["Computational Model", "IE", "EE" ],
      // description: ["Complete your computational model lessons", "", ""],
      // route: ["Construct", "IELanding", "EELanding"],
      engineering: true,
    };
  },
};
</script>
