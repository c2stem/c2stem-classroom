<template>
  <div class="container">
    <div class="row">
      <div class="register">
        <h1>Register</h1>
        <form @submit.prevent="register">
          <label for="email"> Email: </label>
          <input v-model="email" type="email" name="email" value />

          <label for="username"> Username: </label>
          <input v-model="username" type="text" name="username" value />

          <label for="password"> Password: </label>
          <input v-model="password" type="password" name="password" value />

          <label for="role">Choose a role:</label>
          <select id="role" name="role" v-model="role">
            <option value="user">User</option>
            <option value="teacher">Teacher</option>
          </select>
          <button type="submit" name="button">Register</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      username: "",
      password: "",
      role: ""
    };
  },
  methods: {
    register() {
        this.$store
            .dispatch('register', {
              username: this.username,
              email: this.email,
              role: this.role,
              password: this.password
            })
            .then(() => {
              this.$router.push({ name: 'Login' })
            })

    },
  },
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
