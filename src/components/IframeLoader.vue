<template>
  <iframe
    :src="iframeSource"
    :id="iframeid"
    sandbox="allow-scripts
    allow-same-origin"
    height="100%"
    width="100%"
    frameborder="0"
  ></iframe>
</template>

<script>
export default {
  name: "IframeLoader",
  props: {
    source: {
      type: String,
      required: true,
    },
    iframeid: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    projectname: {
      type: String,
      required: true,
    },
    embed: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      iframeSource: "",
    };
  },
  created() {
    if (this.embed) {
      this.iframeSource =
        this.source +
        "/?action=present&Username=" +
        this.username +
        "&ProjectName=" +
        this.projectname +
        "&embedMode&noExitWarning&noRun";
    } else {
      this.iframeSource =
        this.source +
        "/?action=present&Username=" +
        this.username +
        "&ProjectName=" +
        this.projectname +
        "&noExitWarning&noRun&editMode";
    }
  },
};
</script>
