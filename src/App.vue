<template>
  <class-header></class-header>
  <router-view/>
</template>

<script>

import ClassHeader from './components/ClassHeader.vue';

export default {
  name: "App",
  components: {
    ClassHeader
  }
};
</script>

<style>
html,
body {
  min-height: 100%;
  height: 100%;
  margin: 0;
}
</style>
