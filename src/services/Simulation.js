export default {
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
