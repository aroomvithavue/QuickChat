<template>
  <main class="flex max-h-[95vh] my-0 w-screen">
    <!-- Side Bar Code -->
    <div class="flex flex-col w-1/4 h-full min-h-[95vh] border-r-4">
      <div v-if="joinedRoom.length === 0">
        <h1 class="mt-10 text-2xl font-bold">No Room Joined Yet!</h1>
      </div>

      <div v-else>
        <div class="mt-10">
          <h1 class="font-bold">Keyword</h1>
          <p>{{ joinedRoom }}</p>
        </div>
        <div class="mt-10">
          <h1 class="font-bold">Participants</h1>
          <p>RoomView101</p>
        </div>
        <div class="mt-10">
          <h1 class="font-bold">Vibe</h1>
          <p>some emojis</p>
        </div>
      </div>
      <footer v-if="joinedRoom.length !== 0" class="mt-auto py-10">
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
      <section id="message-container" v-else class="overflow-y-auto">
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
      <footer
        v-if="joinedRoom.length !== 0"
        class="mt-auto py-4 border-t-4 flex flex-wrap -mb-px items-center justify-center"
      >
        <label for="chat" class="sr-only">Your Message</label>
        <div
          class="flex items-center w-full px-3 py-2 rounded-lg dark:bg-gray-700"
        >
          <button
            type="button"
            class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <img
              src="https://img.icons8.com/ios-glyphs/30/000000/question--v1.png"
            />
          </button>
          <button
            type="button"
            class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <img
              src="https://img.icons8.com/material-outlined/30/null/smiling.png"
            />
          </button>
          <textarea
            id="chat"
            rows="1"
            name="message"
            v-model="text"
            class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Your message..."
          ></textarea>
          <button
            @click="sendMessage"
            class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
          >
            <svg
              aria-hidden="true"
              class="w-6 h-6 rotate-90"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
              ></path>
            </svg>
            <span class="sr-only">Send message</span>
          </button>
          <button
            type="button"
            class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <img src="https://img.icons8.com/windows/32/null/file-upload.png" />
          </button>
        </div>
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
