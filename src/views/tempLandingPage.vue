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
  name: "Landing",
  components: {
    LessonCard,
  },
  data() {
    return {
      names: ["Lesson one", "Lesson two", "Lesson three" ],
      description: ["Computational Modeling", "Computational Modeling", "Computational Modeling"],
      route: ["/construct", "/construct", "/construct"],
      engineering: true,
    };
  },
};
</script>
