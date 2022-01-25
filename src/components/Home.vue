<template>
  <iframe
    src="https://physdev.c2stem.org"
    id="iframe-id"
    sandbox="allow-scripts allow-same-origin"
    height="100%"
    width="100%"
    frameborder="0"
  ></iframe>
</template>
<script>
export default {
  name: "Home",
  mounted() {
    var ifr_window = document.getElementById("iframe-id");
    const api = new window.EmbeddedNetsBloxAPI(ifr_window);
    console.log(api);
    this.getActions(api);
  },
  methods: {
    getActions(api) {
      setTimeout(() => {
        api.addActionListener((action) => {
          console.log(`applied action: ${JSON.stringify(action)}`);
        });
      }, 5000);
    },
  },
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
