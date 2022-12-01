<template>
  <main class="flex justify-evenly items-center h-[95vh] flex-wrap my-4">
    <div class="flex flex-row card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Create Chat</h2>
        <p>Duration</p>
        <div class="card-actions justify-end">
          <a href="#/chat" class="link link-primary"
            ><button class="btn btn-primary">Generate Chat</button></a
          >
        </div>
      </div>
    </div>

    <div class="flex flex-row card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Join Chat</h2>
        <form @submit="handleSubmit">
          <input
            type="text"
            placeholder="Keyword"
            class="input w-full max-w-xs my-4 input-bordered"
          />
          <div class="card-actions justify-end">
            <input type="submit" class="btn" />
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: "HomeView",
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.$router.push({
        name: "chat",
        params: { keyword: e.target[0].value },
      });
    },
  },
};
</script>
