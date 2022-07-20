<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="iframe-panel">
          <iframe-loader
            source="https://physdev.c2stem.org"
            iframeid="iframe-id"
            username="naveed"
            projectname="1d sloth"
            :embed="true"
          ></iframe-loader>
        </div>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Instructions</h5>
            <p class="card-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <a href="#" class="card-link">Read more</a>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="right-panel mt-5">
          <ul class="nav nav-pills border border-3" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                Test Model
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                Get Test History
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="pills-contact-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-contact"
                type="button"
                role="tab"
                aria-controls="pills-contact"
                aria-selected="false"
              >
                Visualize
              </button>
            </li>
          </ul>
          <div class="tab-content border border-3" id="pills-tabContent">
            <div
              class="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
              tabindex="0"
            >
              ...
            </div>
            <div
              class="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
              tabindex="0"
            >
              ...
            </div>
            <div
              class="tab-pane fade"
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
              tabindex="0"
            >
              ...
            </div>
            <div
              class="tab-pane fade"
              id="pills-disabled"
              role="tabpanel"
              aria-labelledby="pills-disabled-tab"
              tabindex="0"
            >
              ...
            </div>
          </div>
          <div class="notes-panel">
            <textarea class="form-ceontrol" placeholder="Leave a note here.." style="width:100%"></textarea>
            <button type="button" class="btn btn-primary">Add Note</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IframeLoader from "../components/IframeLoader.vue";

export default {
  components: {
    IframeLoader,
  },
};
</script>

<style scoped>
.container {
  max-width: 100%;
  max-height: 80%;
  display: grid;
}
div {
  min-height: 0;
}
.iframe-panel {
  margin: 10px;
  height: 400px;
}
.card {
  margin: 10px;
}
.right-panel{
    height: 70%;
}
.notes-panel{
    height: 30%;
    display: flex;
}
</style>
