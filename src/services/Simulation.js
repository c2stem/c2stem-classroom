/**
 * Simulation Service.
 * Methods related to C2STEM GUI and C2STEM simulation. 
 */
export default {
  /**
   * Green flag run method.
   * Accesses the NetsBloxMorph of C2STEM and runs scripts. 
   * @param {Event} event Capturing keyevents to act on SHIFT presses.
   */
  runProject(event) {
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
  getImage() {
    var iframe = document.getElementById("iframe-id"),
      world = iframe.contentWindow.world,
      ide = world.children[0],
      stage = ide.children[4],
      imgCanvas = stage.fullImage();
    let image = new Image();
    image.src = imgCanvas.toDataURL();
    return image;
  },
};
