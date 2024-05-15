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
      const iframe = document.getElementById("iframe-id");
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
    const projects = [];
    const user = sessionStorage.getItem("user");
    if (user) {
      try {
        let response = await axios.get(
          "https://editor.c2-stem.org/api/getProjectList",
          { withCredentials: true }
        );
        const pl = response.data.split(" ");
        pl.forEach((element) => {
          const project = element.split("&")[0];
          const projectName = project.split("=")[1];
          projects.push(projectName);
        });
      } catch (error) {
        console.log("the error is ", error);
      }
    }
    return projects;
  },

  async getProjectListByUser(username) {
    if (username) {
      try {
        let response = await axios.get(
          "https://editor.c2-stem.org/api/projects/" + username,
          { withCredentials: true }
        );
        return response.data;
      } catch (error) {
        console.log("the error is ", error);
      }
    }
    return [];
  },

  async getSharedProjectList() {
    const projects = [];
    const user = sessionStorage.getItem("user");
    if (user) {
      try {
        let response = await axios.get(
          "https://editor.c2-stem.org/api/getSharedProjectList",
          { withCredentials: true }
        );
        const pl = response.data.split(" ");
        pl.forEach((element) => {
          const project = element.split("&")[0];
          const projectName = project.split("=")[1];
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
  async getProject(projectName) {
    const iframe = document.getElementById("iframe-id"),
      api = new window.EmbeddedNetsBloxAPI(iframe);
    let projectResponse = await api.getProjectXML();
    // world = iframe.contentWindow.world,
    // ide = world.children[0];
    // var projectResponse = ide.exportProject(projectName, false);
    const user = sessionStorage.getItem("user");
    var currentDate = new Date();
    var datetime =
      currentDate.getDate() +
      "_" +
      (currentDate.getMonth() + 1) +
      "_" +
      currentDate.getFullYear() +
      "_" +
      currentDate.getHours() +
      ":" +
      currentDate.getMinutes() +
      ":";
    const fileName = user + "_" + projectName + "_" + datetime + ".xml";
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:attachment/xml," + encodeURI(projectResponse)
    );
    element.setAttribute("download", fileName);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  },
  async saveToCloud(projectName) {
    const iframe = document.getElementById("iframe-id");
    const api = new window.EmbeddedNetsBloxAPI(iframe);
    await api.saveToCloud(projectName);
  },
  async publishProject(projectName, publish) {
    const iframe = document.getElementById("iframe-id");
    const api = new window.EmbeddedNetsBloxAPI(iframe);
    await api.publishProject(projectName, publish);
  },
  async saveToLocal(projectXML) {
    const element = document.createElement("a");
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
  async deleteProject(projectName) {
    const iframe = document.getElementById("iframe-id");
    const api = new window.EmbeddedNetsBloxAPI(iframe);
    let projectExists = await this.projectExists(projectName);
    if (projectExists) {
      await api.deleteProject(projectName);
    } else {
      console.log("project does not exist");
    }
  },

  async deleteProjectByName(projectName) {
    let response = "";
    const user = sessionStorage.getItem("user");
    if (user) {
      try {
        response = await axios.post(
          "https://editor.c2-stem.org/api/deleteProject",
          { ProjectName: projectName },
          { withCredentials: true },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        if (response.data === "project deleted!") {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log("the error is ", error);
      }
    }
  },
  /**
   * Green flag run method.
   * Accesses the NetsBloxMorph of C2STEM and runs scripts.
   * @param {Event} event Capturing keyevents to act on SHIFT presses.
   */
  runProjectOnDomain(event) {
    try {
      const iframe = document.getElementById("iframe-id"),
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
    const iframe = document.getElementById("iframe-id"),
      world = iframe.contentWindow.world,
      ide = world.children[0],
      // stage = ide.children[4], // stage location for physdev
      stage = ide.children[3],
      imgCanvas = stage.fullImage();
    let image = new Image();
    image.src = imgCanvas.toDataURL();
    return image;
  },

  // async saveHistory(checkList, user){
  //   let response = await axios.post("//localhost:8203/history/setChecks", {
  //     username: user,
  //     checkList: checkList,
  //   });
  //   if (response) {
  //     console.log("successfully saved checklist: ", response);
  //   }
  // }
};
