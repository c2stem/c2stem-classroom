<template>
  <iframe
    src="https://physdev.c2stem.org"
    sandbox="allow-scripts allow-same-origin"
    height="100%"
    width="100%"
    frameborder="0"
  ></iframe>
</template>
<script>
export default {
  name: "Home",
};
</script>

<style>
div {
  min-height: 100%;
  height: 100%;
}

iframe {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
