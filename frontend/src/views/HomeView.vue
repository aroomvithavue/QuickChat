<template>
  <div class="home">
    <div class="card">
      <figure>
        <img alt="Vue logo" src="../assets/logo.png" />
      </figure>
      <div class="card-body">
        <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

export default Vue.extend({
  name: "HomeView",
  components: {
    HelloWorld,
  },
});
</script>
