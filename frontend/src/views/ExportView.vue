<template>
  <main>
    <!-- Header Code -->
    <header class="btn btn-ghost normal-case text-xl">
      Use your browser to print or save this view.
    </header>

    <!-- Chat Code -->
    <div v-for="message in messages" :key="message.id">
      <b>
        {{ message.author }}
      </b>
      : {{ message.text }}
    </div>
  </main>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "ExportView",
  props: {
    password: {
      type: String,
    },
  },
  data() {
    return {
      messages: [],
    };
  },
  async created() {
    // determine correct backend url for dev versus production
    const isProd = process.env.NODE_ENV === "production";
    const room = this.$route.params.keyword;

    // retrieve the messages for this room
    const url2 =
      (isProd
        ? "https://quickchat-api-61040.herokuapp.com/"
        : "http://localhost:3000/") + `api/chatRooms?keyword=${room}`;
    //   const url = `http://localhost:3000/api/chatRooms?keyword=${room}`;

    try {
      const r = await fetch(url2, {
        method: "GET",
        headers: { chatPassword: this.password },
        type: "application/json",
      });
      // const r = await fetchFromApi(`/chatRooms?keyword=${room}`, "GET");
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }

      this.messages = res.messages;
    } catch (e) {
      console.log("Could not fetch messages:", e);
    }
  },
  updated() {
    window.print();
  },
};
</script>
