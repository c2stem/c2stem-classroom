import {
  AudioPresets,
  createLocalAudioTrack,
  Room,
  RoomEvent,
  Track,
  VideoPresets,
} from "livekit-client";

export default {
  name: "LiveKit",
  async tryAndPublish(identity, store) {
    const tokenResponse = await fetch(
      `https://sharer-local.syncflow.live/api/token?identity=${identity}`
      // `https://mime-sharer.syncflow.live/api/token?identity=${identity}`
    );

    if (!tokenResponse.status === 200) {
      return;
    }

    const tokenDetails = await tokenResponse.json();
    const videoDevices = await Room.getLocalDevices("videoinput");
    const audioDevices = await Room.getLocalDevices("audioinput");

    const selectedMics = audioDevices.filter((audioDevice) => {
      console.log(audioDevice.kind);
      console.log(
        audioDevice.label.toLowerCase().includes("realtek"),
        "isjack"
      );
      console.log(audioDevice.label.toLowerCase().includes("usb"), "isusb");

      if (
        audioDevice.deviceId === "default" ||
        audioDevice.deviceId === "communications"
      ) {
        return false;
      }

      return (
        audioDevice.label.toLowerCase().includes("realtek") ||
        audioDevice.label.toLowerCase().includes("usb") ||
        audioDevice.label.toLowerCase().includes("cirrus")
      );
    });

    const selectedCamera = videoDevices.find(
      (videoDevice) =>
        videoDevice.id !== "default" &&
        videoDevice.label.toLowerCase().includes("integrated")
    );

    let videoDeviceId = "default";

    if (selectedCamera) {
      videoDeviceId = selectedCamera.deviceId;
    }

    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
      videoCaptureDefaults: {
        resolution: VideoPresets.h1080.resolution,
      },
      audioCaptureDefaults: {
        sampleRate: AudioPresets.musicHighQuality.maxBitRate,
      },
      publishDefaults: {
        videoCodec: "h264",
        audioPreset: AudioPresets.MusicHighQuality,
      },
      stopLocalTrackOnUnpublish: true,
    });

    await room.connect(tokenDetails.livekitServerUrl, tokenDetails.token);
    store.dispatch("addLivekitRoom", { room: room });

    room.on(RoomEvent.Disconnected, () => {
      console.log("Disconnected from LiveKit");
      this.tryAndPublish(identity);
    });
    // eslint-disable-next-line no-unused-vars
    const publication = await room.localParticipant.setScreenShareEnabled(
      true,
      {
        contentHint: "detail",
        audio: false,
        resolution: VideoPresets.h1080.resolution,
        video: { displaySurface: "monitor" },
      },
      {
        videoCodec: "h264",
        name: `${tokenDetails.identity}'s-screen`,
        simulcast: true,
      }
    );

    // eslint-disable-next-line no-unused-vars
    const cameraPublication = await room.localParticipant.setCameraEnabled(
      true,
      {
        deviceId: videoDeviceId,
        resolution: VideoPresets.h1080.resolution,
      },
      {
        videoCodec: "h264",
        name: `${tokenDetails.identity}-screen`,
      }
    );

    const publishedMics = await Promise.all(
      selectedMics.map((dev) => this.publishAudioTrack(room, dev))
    );

    try {
      await fetch(
        `https://sharer-local.syncflow.live/api/publication_record`,
        // `https://mime-sharer.syncflow.live/api/publication_record`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identity: identity,
            sessionName: room.name,
            mics: publishedMics,
          }),
        }
      );
    } catch {
      console.log("error");
    }
  },

  async publishAudioTrack(room, audioDevice) {
    const localAudioTrack = await createLocalAudioTrack({
      deviceId: audioDevice.deviceId,
      sampleRate: AudioPresets.musicHighQuality.maxBitrate,
      channelCount: 1,
    });

    const publication = await room.localParticipant.publishTrack(
      localAudioTrack,
      {
        audioPreset: AudioPresets.musicHighQuality,
        dtx: false,
        red: false,
        source: Track.Source.Microphone,
        name: `${audioDevice.label}-microphone`,
      }
    );

    return {
      publicationSid: publication.trackSid || publication.trackInfo?.sid || "",
      deviceId: audioDevice.deviceId,
      deviceName: `${audioDevice.label}`,
      kind: "audio",
    };
  },
};
