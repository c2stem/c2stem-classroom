/**
 * Simulation Service.
 * Methods related to C2STEM GUI and C2STEM simulation.
 */
import axios from "axios";
export default {
  runProject() {
    try {
      const iframe = document.getElementById("iframe-id");
      const api = new window.EmbeddedNetsBloxAPI(iframe);
      api.runProject();
    } catch (error) {
      alert(error.message);
    }
  },

  async getImage() {
    try {
      var iframe = document.getElementById("iframe-id");
      const api = new window.EmbeddedNetsBloxAPI(iframe);
      const stage = await api.getStageImage();
      let image = new Image();
      image.src = stage;
      return image;
    } catch (error) {
      alert(error.message);
    }
  },
  async getProjectList() {
    var projects = [];
    const user = localStorage.getItem("user");
    if (user) {
      try {
        let response = await axios.get(
          "https://editor.c2stem.org/api/getProjectList",
          { withCredentials: true }
        );
        var pl = response.data.split(" ");
        pl.forEach((element) => {
          var project = element.split("&")[0];
          var projectName = project.split("=")[1];
          projects.push(projectName);
        });
      } catch (error) {
        console.log("the error is ", error);
      }
    }
    return projects;
  },
  async getSharedProjectList() {
    var projects = [];
    const user = localStorage.getItem("user");
    if (user) {
      try {
        let response = await axios.get(
          "https://editor.c2stem.org/api/getSharedProjectList",
          { withCredentials: true }
        );
        var pl = response.data.split(" ");
        pl.forEach((element) => {
          var project = element.split("&")[0];
          var projectName = project.split("=")[1];
          projects.push(projectName);
        });
      } catch (error) {
        console.log("the error is ", error);
      }
    }
    return projects;
  },
  async projectExists(projectName) {
    let projects = await this.getProjectList();
    if (projects.includes(projectName)) {
      return true;
    } else {
      return false;
    }
  },
  async sharedProjectExists(projectName) {
    let projects = await this.getSharedProjectList();
    if (projects.includes(projectName)) {
      return true;
    } else {
      return false;
    }
  },
  async getProject() {
    const iframe = document.getElementById("iframe-id");
    const api = new window.EmbeddedNetsBloxAPI(iframe);
    const xml = await api.getProjectXML();
    return xml;
  },
  async saveToCloud(projectName) {
    const iframe = document.getElementById("iframe-id");
    const api = new window.EmbeddedNetsBloxAPI(iframe);
    api.saveToCloud(projectName);
  },
  async publishProject(projectName, publish) {
    const iframe = document.getElementById("iframe-id");
    const api = new window.EmbeddedNetsBloxAPI(iframe);
    api.publishProject(projectName, publish);
  },
  async saveToLocal(projectXML) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:attachment/xml," + encodeURI(projectXML)
    );
    element.setAttribute("download", "Saved_Project");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },
  /**
   * Green flag run method.
   * Accesses the NetsBloxMorph of C2STEM and runs scripts.
   * @param {Event} event Capturing keyevents to act on SHIFT presses.
   */
  runProjectOnDomain(event) {
    try {
      var iframe = document.getElementById("iframe-id"),
        world = iframe.contentWindow.world,
        ide = world.children[0];
      if (event.shiftKey) {
        ide.toggleFastTracking();
      } else {
        ide.stage.threads.pauseCustomHatBlocks = false;
        ide.runScripts();
        if (ide.embedOverlay) {
          ide.embedOverlay.destroy();
          ide.embedPlayButton.destroy();
        }
      }
      world.worldCanvas.focus();
    } catch (error) {
      alert(error.message);
    }
  },

  /**
   * Accesses the NetsBloxMorph of C2STEM and capture the Stage image.
   * @returns current stage image
   */
  getImageOnDomain() {
    var iframe = document.getElementById("iframe-id"),
      world = iframe.contentWindow.world,
      ide = world.children[0],
      // stage = ide.children[4], // stage location for physdev
      stage = ide.children[3],
      imgCanvas = stage.fullImage();
    let image = new Image();
    image.src = imgCanvas.toDataURL();
    return image;
  },

  async saveHistory(checkList, user){
    let response = await axios.post("//localhost:8203/history/setChecks", {
      username: user,
      checkList: checkList,
    });
    if (response) {
      console.log("successfully saved checklist: ", response);
    }
  }
};
