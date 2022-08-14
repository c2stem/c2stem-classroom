<template>
<!-- Iframe Loader Component -->
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
/**
 * Iframe Loader Component
 * Generates an iframe with an embedded c2stem based on the data passed through props.
 */
export default {
  name: "IframeLoader",
  props: {
    /**
     * URL to be loaded in an iframe.
     */
    source: {
      type: String,
      required: true,
    },
    /**
     * Iframe id for DOM manipulation.
     */
    iframeid: {
      type: String,
      required: true,
    },
    /**
     * C2STEM username to access the user project form user's account in C2STEM cloud.
     */
    username: {
      type: String,
      required: true,
    },
    /**
     * Project name to be loaded from user's account in C2STEM cloud.
     */
    projectname: {
      type: String,
      required: true,
    },
    /**
     * Activate embed mode for the C2STEM project.
     * @values true, false.
     */
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
    /**
     * Based on the data from props, generate an iframe source url.
     */
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
