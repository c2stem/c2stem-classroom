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
import simulationService from "../services/Simulation.js";
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
      userid: "",
      actionType: "present",
    };
  },
  computed: {
    loggedIn() {
      return localStorage.getItem("user");
    },
    projectNameExists() {
      return localStorage.getItem("projectName");
    },
  },
  created() {
    /**
     * Based on the data from props, generate an iframe source url.
     */
    if (this.loggedIn) {
      var projectExist = simulationService.projectExists(this.projectname);
      projectExist
        .then((response) => {
          if (response) {
            this.userid = this.loggedIn.replace(/["]+/g, "");
          } else {
            this.userid = this.username;
          }
          if (this.projectNameExists) {
            localStorage.removeItem("projectName");
            localStorage.setItem("projectName", this.projectname);
          } else {
            localStorage.setItem("projectName", this.projectname);
          }
          if (this.embed) {
            this.iframeSource =
              this.source +
              "/?action=" +
              this.actionType +
              "&Username=" +
              this.userid +
              "&ProjectName=" +
              this.projectname +
              "&embedModeNoFlag&noExitWarning&noRun";
          } else {
            this.iframeSource =
              this.source +
              "/?action=" +
              this.actionType +
              "&Username=" +
              this.userid +
              "&ProjectName=" +
              this.projectname +
              "&noExitWarning&noRun&editMode&noExitWarning";
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  },
};
</script>
