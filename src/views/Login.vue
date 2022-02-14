<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-4 col-md-6 col-sm-8 mx-auto">
        <h1>Sign In</h1>
        <form @submit.prevent="login">
          <label for="username"> Username: </label>
          <input v-model="username" type="text" name="username" value />

          <label for="password"> Password: </label>
          <input v-model="password" type="password" name="password" value />

          <button type="submit" name="button">Login</button>
          
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      username: '',
      password: '',
    }
  },
  methods: {
    login() {

    }
  }
};
</script>

<style>
form {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 15em;
  margin-bottom: 2em;
}
.container{
    display: flex;
    justify-content: center;
}
</style>
