<template>
  <main class="flex">
    <!-- Side Bar Code -->
    <div class="flex flex-col w-1/5 h-screen border-r-4">
      <div class="mt-10">
        <h1 class="font-bold">Keyword</h1>
        <p>yellkey</p>
      </div>
      <div class="mt-10">
        <h1 class="font-bold">Participants</h1>
        <p>RoomView101</p>
      </div>
      <div class="mt-10">
        <h1 class="font-bold">Vibe</h1>
        <p>some emojis</p>
      </div>
      <footer class="mt-auto py-10">
        <button class="btn mt-2 max-w-xs mt-10">Export Chat</button>
        <button
          v-if="joinedRoom.length !== 0"
          class="btn mt-2 max-w-xs ml-2"
          @click="leaveRoom"
        >
          Leave this room
        </button>

        <input
          type="text"
          class="input input-bordered w-full max-w-xs mt-10"
          name="username"
          v-model="username"
        />
        <button class="btn mt-2 max-w-xs mt-10" @click="changeName">
          Change name
        </button>
      </footer>
    </div>
    <!-- Side Bar Code -->

    <div class="flex flex-col w-3/4">
      <!-- Chat Header Code -->
      <header class="py-4 border-b-4">
        <ChatHeader />
      </header>
      <!-- Chat Header Code -->

      <!-- Chat Code -->
      <section v-if="joinedRoom.length === 0">
        <p>Available rooms by room keyword (click to join):</p>
        <div v-for="room in rooms" :key="room" @click="joinRoom(room)">
          <button class="btn">{{ room }}</button>
        </div>
      </section>
      <section v-else>
        <h2 class="font-bold">Room: {{ joinedRoom }}</h2>
        <div
          class="chat chat-start"
          v-for="message in messages"
          :key="message.id"
        >
          <div class="chat-header">
            {{ message.author }}
          </div>
          <div class="chat-bubble">{{ message.text }}</div>
        </div>
      </section>
      <footer v-if="joinedRoom.length !== 0" class="mt-auto py-4 border-t-4">
        <input
          type="text"
          class="textarea textarea-bordered"
          name="message"
          v-model="text"
        />
        <button class="btn" @click="sendMessage">Send message</button>
      </footer>

      <!-- Chat Code -->
    </div>
  </main>
</template>

<script>
import ChatHeader from "@/components/Chat/ChatHeader.vue";
import io from "socket.io-client";

export default {
  name: "MainChat",
  components: { ChatHeader },
  data() {
    return {
      username: "Anonymous",
      text: "",
      messages: [],
      rooms: ["apple"], // list of strings (room names)
      joinedRoom: "",
    };
  },
  created() {
    // determine correct backend url for dev versus production
    const isProd = process.env.NODE_ENV === "production";
    const url = isProd
      ? "https://quickchat-api-61040.herokuapp.com/"
      : "localhost:3000/";

    // initialize socket
    this.socketInstance = io(url);

    // receive message
    this.socketInstance.on("message:received", (data) => {
      this.messages = this.messages.concat(data);
    });

    // reflect changed name
    this.socketInstance.on("username:received", (data) => {
      this.updateNameInMessages(data.userId, data.newUsername);
    });

    // someone joined
    this.socketInstance.on("join", (data) => {
      this.messages = this.messages.concat(data);
    });

    // someone left
    this.socketInstance.on("leave", (data) => {
      this.messages = this.messages.concat(data);
    });
  },
  methods: {
    // send message
    sendMessage() {
      const message = {
        id: new Date().getTime(),
        text: this.text,
        username: this.username,
        userId: this.socketInstance.id,
        roomName: this.joinedRoom,
        author: this.username,
      };
      this.messages = this.messages.concat(message); // show message in my client
      this.socketInstance.emit("message", message); // send message to others
      this.text = ""; // intialize input
    },
    changeName() {
      this.socketInstance.emit("username", {
        userId: this.socketInstance.id,
        newUsername: this.username,
      }); // send new name to others

      this.updateNameInMessages(this.socketInstance.id, this.username); // change name in my chat
    },
    updateNameInMessages(userId, newUsername) {
      this.messages = this.messages.map((message) => {
        if (message.userId === userId) {
          return {
            ...message,
            username: newUsername,
          };
        }
        return message;
      });
    },
    async joinRoom(room) {
      this.socketInstance.emit("join-room", {
        roomName: room,
      });
      this.joinedRoom = room;

      // retrieve the messages for this room
      const isProd = process.env.NODE_ENV === "production";
      const url =
        (isProd
          ? "https://quickchat-api-61040.herokuapp.com/"
          : "http://localhost:3000/") + `api/chatRooms?keyword=${room}`;
      //   const url = `http://localhost:3000/api/chatRooms?keyword=${room}`;

      try {
        const r = await fetch(url);
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
    leaveRoom() {
      this.socketInstance.emit("leave-room", {
        roomName: this.joinedRoom,
      });
      this.joinedRoom = "";
    },
  },
};
</script>
