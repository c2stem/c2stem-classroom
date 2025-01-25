<template>
  <!-- Login View -->
  <div class="login-card">
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="login">
          <div class="mb-3">
            <h2>Sign in to C2STEM</h2>
          </div>
          <div class="mb-3">
            <label for="userNameId" class="form-label">Username</label>
            <input
              v-model="username"
              type="string"
              class="form-control"
              id="userNameId"
            />
          </div>
          <div class="mb-3">
            <label for="passwordId" class="form-label">Password</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              id="passwordId"
            />
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  </div>
  <AlertBox :message="alertMessage" v-if="isActive"></AlertBox>
</template>

<script>
/**
 * Login View
 * @requires ../services/Auth.js that contains method for login.
 */
import auth from "../services/Auth.js";
import nav from "../services/Navigation.js";
import Token from "../services/Token";
import AlertBox from "../components/AlertBox.vue";
import Logger from "../services/Logger";
import {
  AudioPresets,
  createLocalAudioTrack,
  Room,
  Track,
  VideoPresets,
} from "livekit-client";
export default {
  components: { AlertBox },
  data() {
    return {
      username: "",
      password: "",
      ServerURL: "https://editor.c2stem.org",
      cardActive: false,
      alertMessage: "",
    };
  },
  computed: {
    isActive() {
      return this.cardActive;
    },
    currentRouteName() {
      return this.$route.name;
    },
  },
  methods: {
    /**
     * Sends a http request to the server with user credentials.
     * @requires username,password.
     * On successful login save user credentials to maintain state.
     * On successful login route the user to landing page.
     */
    login() {
      auth
        .login({
          username: this.username,
          password: this.password,
        })
        .then(async ({ data }) => {
          if (data.message) {
            this.cardActive = true;
            this.alertMessage = data.message;
            await Logger.logUserActions({
              username: this.username,
              actionType: "login",
              actionView: this.currentRouteName,
              args: { status: data.message },
            });
            return;
          } else if (data.token) {
            this.cardActive = true;
            this.alertMessage = "User found. Logging in...";
            await Logger.logUserActions({
              username: this.username,
              actionType: "login",
              actionView: this.currentRouteName,
              args: { status: "successful" },
            });
          }
          auth
            .netsbloxLogin({
              username: this.username,
              password: this.password,
              ServerURL: this.ServerURL,
            })
            .catch((err) => {
              console.log(err);
            })
            .then(async (response) => {
              if (response) {
                data.username = this.username;
                Token.setAccessToken(data.token);
                // let syncflowData = await auth.initializeSyncFLow(data.username);
                // if (syncflowData) {
                //   console.log(syncflowData);
                try {
                  await this.tryAndPublish(data.username);
                  // // Add awaits in sequence
                  // await LivekitRoom.connect(
                  //   syncflowData.livekitServerUrl,
                  //   syncflowData.token
                  // );
                  // await LivekitRoom.localParticipant.enableCameraAndMicrophone();
                  // await LivekitRoom.localParticipant.setScreenShareEnabled(
                  //   true
                  // );
                } catch (err) {
                  console.log(err);
                }
                // }
                this.$store.dispatch("updateStore", data.username);
                this.$store.dispatch("saveCredentials", data).then(() => {
                  const reRoute = nav.routeByClassOnLogin(data);
                  this.$router.push({ name: reRoute });
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async tryAndPublish(identity) {
      const tokenResponse = await fetch(
        // `https://sharer-local.syncflow.live/api/token?identity=${identity}`
        `https://meme-sharer.syncflow.live/api/token?identity=${identity}`
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
          // `https://sharer-local.syncflow.live/api/publication_record`,
          `https://meme-sharer.syncflow.live/api/publication_record`,

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
        publicationSid:
          publication.trackSid || publication.trackInfo?.sid || "",
        deviceId: audioDevice.deviceId,
        deviceName: `${audioDevice.label}`,
        kind: "audio",
      };
    },
  },
  mounted() {
    this.emitter.on("alert", (evt) => {
      if (evt.data) {
        if (document.getElementById("alertID")) {
          document.getElementById("alertText").innerText = evt.data;
          document.getElementById("alertID").style.display = "flex";
        } else {
          this.alertMessage = evt.data;
          this.cardActive = true;
        }
      }
    });
    this.emitter.on("close-alert", () => {
      this.cardActive = false;
      this.alertMessage = "";
    });
  },
};
</script>
<style scoped>
.card {
  height: fit-content;
  margin: 20px;
  width: 400px;
}
div {
  min-height: 0;
}
.login-card {
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
