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
      names: ["Computational Model"],
      description: ["Complete your computational model lessons"],
      route: ["Construct"],
      routeParams: [{}],
      // names: ["Computational Model", "IE", "EE" ],
      // description: ["Complete your computational model lessons", "", ""],
      // route: ["Construct", "IELanding", "EELanding"],
      engineering: true,
    };
  },
};
</script>
