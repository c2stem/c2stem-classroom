/**
 * Simulation Service.
 * Methods related to C2STEM GUI and C2STEM simulation. 
 */
export default {
  runProject(){
    try {
      const iframe = document.getElementById('iframe-id');
      const api = new window.EmbeddedNetsBloxAPI(iframe);
      api.runProject();
    } catch (error) {
      alert(error.message);
    }
  },

  async getImage(){
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
};
