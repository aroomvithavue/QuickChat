<template>
  <main>
    <div
      class="hero min-h-screen"
      style="background-image: url(https://placeimg.com/1000/800/arch)"
    >
      <div class="hero-overlay bg-opacity-60"></div>
      <div class="hero-content text-center text-neutral-content">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold">Hello there.</h1>
          <p class="mb-5">
            QuickChat Is Your One-Stop Shop for Quick Messaging For Your Next
            Team, Project, Lecture, and More.
          </p>
          <p>No Sign In. No Sign Up.</p>
          <a href="#joinCreateChat">
            <button class="btn btn-primary mt-5">Get Started</button>
          </a>
        </div>
      </div>
    </div>
    <p id="joinCreateChat" class="mt-10 font-bold text-6xl">QuickChat</p>
    <p class="mt-5">A lightweight and easy to use messaging platform</p>
    <p class="mt-10 font-bold text-xl">Features</p>
    <p class="mt-5">
      You can create a chatroom for a certain duration of time. This will
      automatically generate a unique chatroom keyword for you and place you in
      the chatroom.
    </p>
    <p class="mt-5">
      You can also join a chatroom by a specifc unique keyword.
    </p>
    <p class="mt-5">
      Within a chatroom, you can upload files, send messages, and share your
      overall vibe with everyone else in the room.
    </p>
    <p class="mt-10 font-bold text-4xl">Get Started Below!</p>
    <div class="flex justify-evenly items-center h-[50vh] flex-wrap my-4">
      <div class="flex flex-row card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-base-content">Create Chat</h2>
          <form @submit="handleGenerate">
            <div class="form-controll w-full my-4 max-w-xs">
              <label class="label"
                ><span class="label-text">Expiration</span></label
              >
              <select
                class="select select-bordered bg-base-100 text-base-content w-full max-w-xs"
              >
                <option :value="JSON.stringify({ days: 0, hours: 2 })" selected>
                  2 hours
                </option>
                <option :value="JSON.stringify({ days: 0, hours: 5 })">
                  5 hours
                </option>
                <option :value="JSON.stringify({ days: 1, hours: 0 })">
                  1 day
                </option>
                <option :value="JSON.stringify({ days: 2, hours: 0 })">
                  2 days
                </option>
              </select>
            </div>
            <div class="card-actions justify-end">
              <input type="submit" class="btn btn-primary" value="Create" />
            </div>
          </form>
        </div>
      </div>

      <div class="flex flex-row card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-base-content">Join Chat</h2>
          <form @submit="handleJoin">
            <input
              type="text"
              placeholder="Keyword"
              class="input w-full max-w-xs my-4 input-bordered bg-base-100 text-base-content"
            />
            <div class="card-actions justify-end">
              <input type="submit" class="btn btn-primary" value="Join" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: "HomeView",
  methods: {
    handleJoin(e) {
      e.preventDefault();
      const keyword = e.target[0].value;
      if (keyword === "") {
        this.$store.commit("alert", {
          message: "Keyword cannot be empty",
          status: "error",
        });
        return;
      }
      this.$router.push({
        name: "chat",
        params: { keyword },
      });
    },
    async handleGenerate(e) {
      e.preventDefault();
      // const body = JSON.parse(e.target[0].value);
      const isProd = process.env.NODE_ENV === "production";
      const url =
        (isProd
          ? "https://quickchat-api-61040.herokuapp.com/"
          : "http://localhost:3000/") + `api/chatRooms`;

      const res = fetch(url, {
        method: "POST",
        body: e.target[0].value,
        headers: { "Content-Type": "application/json" },
      });
      const keyword = (await (await res).json()).keyword;
      this.$router.push({ name: "chat", params: { keyword } });
    },
  },
};
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
