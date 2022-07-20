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
  margin: 0;
  height: 100%;
  width: 100%;
}
</style>
