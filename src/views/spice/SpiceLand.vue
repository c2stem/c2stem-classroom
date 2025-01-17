<template>
  <lesson-card
    :lessonNames="names"
    :description="description"
    :route="route"
    :engineering="engineering"
  ></lesson-card>
</template>

<script>
import LessonCard from "../../components/LessonCard.vue";
export default {
  name: "SpiceLanding",
  components: {
    LessonCard,
  },
  data() {
    return {
      names: [
        "Lesson 1",
        "Lesson 2",
        "Lesson 3",
        "Lesson 4",
        "Lesson 5",
        "Lesson 6",
        "Lesson 7",
        "Computational Model",
      ],
      description: [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Complete your computational model lessons",
      ],
      route: [
        "EDMap",
        "EDMap",
        "EDMap",
        "EDMap",
        "EDMap",
        "EDMap",
        "EELanding",
        "Construct",
      ],
      engineering: true,
    };
  },
};
</script>
