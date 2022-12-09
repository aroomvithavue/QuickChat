<template>
  <main class="flex justify-evenly items-center h-[95vh] flex-wrap my-4">
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
