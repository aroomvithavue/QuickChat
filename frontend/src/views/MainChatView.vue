<template>
  <main class="flex max-h-[95vh] my-0 w-screen bg-base-100 text-base-content">
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
          <h1 class="font-bold">Live Group Vibe</h1>
          <p class="mt-2">How are you feeling right now?</p>
          <div class="flex flex-col justify-center content-center items-center">
            <button
              type="button"
              id="confused"
              @click="voteConfused"
              class="mt-2 p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-bg-content dark:hover:text-white dark:hover:bg-gray-600"
            >
              <img
                class="dark:invert"
                :width="20 + Math.min(6 * this.confusedCount, 60)"
                :height="20 + Math.min(6 * this.confusedCount, 60)"
                src="https://img.icons8.com/ios-glyphs/80/null/question--v1.png"
              />
              <p v-if="this.confusedCount !== 0">{{ this.confusedCount }}</p>
            </button>
            <button
              type="button"
              id="happy"
              @click="voteHappy"
              class="mt-2 p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-bg-content dark:hover:text-white dark:hover:bg-gray-600"
            >
              <img
                class="dark:invert"
                :width="20 + Math.min(6 * this.happyCount, 60)"
                :height="20 + Math.min(6 * this.happyCount, 60)"
                src="https://img.icons8.com/material-outlined/80/null/smiling.png"
              />
              <p v-if="this.happyCount !== 0">{{ this.happyCount }}</p>
            </button>
          </div>
        </div>
      </div>
      <footer v-if="joinedRoom.length !== 0" class="mt-auto py-10">
        <router-link
          :to="{ name: 'export_view', params: { keyword: joinedRoom } }"
          rel="noopener noreferrer"
          target="_blank"
        >
          <button class="btn btn-info mt-2 max-w-xs mt-10">Export Chat</button>
        </router-link>
        <button
          v-if="joinedRoom.length !== 0"
          class="btn mt-2 max-w-xs ml-2 btn-info"
          @click="leaveRoom"
        >
          Leave this room
        </button>

        <form @submit="changeName">
          <input
            type="text"
            class="input input-bordered w-full max-w-xs mt-10"
            name="username"
            :value="username"
          />
          <button class="btn mt-2 max-w-xs mt-10 btn-primary" type="submit">
            Change name
          </button>
        </form>
      </footer>
    </div>
    <!-- Side Bar Code -->

    <div class="flex flex-col w-3/4">
      <!-- Chat Header Code -->
      <header class="py-4 border-b-4">
        <ChatHeader
          @switchToChat="changeToChat"
          @switchToFiles="changeToFiles"
          :filesTabView="inFilesTabView"
        />
      </header>
      <!-- Chat Header Code -->

      <!-- FilesTab Code -->
      <section
        id="filesContainer"
        v-if="inFilesTabView"
        class="overflow-y-auto"
      >
        <ul class="menu bg-base-100 w-full my-8">
          <li
            v-for="f in files"
            :key="f._id"
            class="bordered mx-16 my-1"
            @click="() => handleFileDownload(f.fileId, f.filename)"
          >
            <a>{{ f.filename }}</a>
          </li>
        </ul>
      </section>
      <!-- Chat Code -->
      <section
        id="messageContainer"
        @scroll="handleScroll"
        v-else
        class="overflow-y-auto"
      >
        <div class="chat-start chat-end hidden"></div>
        <div
          :class="`chat chat-${message.uid === uid ? 'end' : 'start'}`"
          v-for="message in messages"
          :key="message.id"
        >
          <div class="chat-header">
            {{ message.author }}
          </div>
          <div
            :class="`chat-bubble ${
              message.uid === uid ? 'chat-bubble-primary' : ''
            }`"
          >
            {{ message.text }}
          </div>
          <div class="chat-footer text-xs opacity-50">
            {{
              new Date(message.date).toLocaleString([], {
                hour: "2-digit",
                minute: "2-digit",
                month: "short",
                day: "2-digit",
              })
            }}
          </div>
        </div>
      </section>
      <footer
        class="mt-auto border-t-4 flex flex-wrap -mb-px items-center justify-center"
      >
        <label for="chat" class="sr-only">Your Message</label>
        <div
          class="flex items-center w-full px-3 py-2 rounded-lg dark:bg-gray-700"
        >
          <textarea
            id="chat"
            rows="1"
            @keypress="handleKeypress"
            name="message"
            v-model="text"
            class="block resize-none mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
          <label for="upload-modal" class="btn btn-ghost">
            <img
              class="dark:invert"
              src="https://img.icons8.com/windows/32/null/file-upload.png"
          /></label>
          <!-- Upload file modal -->
          <input type="checkbox" id="upload-modal" class="modal-toggle" />
          <div class="modal">
            <div class="modal-box relative">
              <label
                for="upload-modal"
                class="btn btn-sm btn-circle absolute right-2 top-2"
                >✕</label
              >
              <form @submit="handleFileUpload" class="flex flex-col gap-4">
                <h3 class="text-xl font-semibold">Upload File To Chat</h3>
                <input
                  type="file"
                  name="file"
                  class="file-input file-input-bordered file-input-primary w-full max-w-s"
                />
                <p>Accepted File Types: jpg, jpeg, txt, gif, pdf, png, svg</p>
                <button
                  type="submit"
                  class="btn btn-primary max-w-xs w-24 self-end"
                >
                  <label for="upload-modal" class="btn btn-ghost max-w-xs w-24"
                    >Upload</label
                  >
                </button>
              </form>
            </div>
          </div>
          <!-- Upload file modal -->
        </div>
      </footer>

      <!-- Chat Code -->
    </div>
  </main>
</template>

<script>
import ChatHeader from "@/components/Chat/ChatHeader.vue";
import io from "socket.io-client";
import { getUserId, getUsername, setUsername } from "@/util.js";

export default {
  name: "MainChat",
  components: { ChatHeader },
  data() {
    return {
      username: "Anonymous",
      uid: "",
      text: "",
      messages: [],
      rooms: ["apple"], // list of strings (room names)
      joinedRoom: "",
      scrolling: false,
      confusedCount: 0,
      happyCount: 0,
      userVotedConfused: false,
      userVotedHappy: false,
      inFilesTabView: false,
      files: [],
      roomId: "",
    };
  },
  created() {
    this.uid = getUserId();
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

    // receive happyVote
    this.socketInstance.on("happyVote:received", (data) => {
      this.happyCount = data.happy;
    });

    // receive confusedVote
    this.socketInstance.on("confusedVote:received", (data) => {
      this.confusedCount = data.confused;
    });
    // Update files
    this.socketInstance.on("fileChange:received", async (data) => {
      await this.refreshFiles();
    });

    // reflect changed name
    this.socketInstance.on("username:received", (data) => {
      this.updateNameInMessages(data.uid, data.newUsername);
    });

    this.joinRoom(this.$route.params.keyword);
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        this.joinRoom(toParams.keyword);
      }
    );

    this.username = getUsername();
  },
  updated() {
    //autoscroll to bottom of chat, if user is not scrolling up
    const container = this.$el.querySelector("#messageContainer");
    if (container && !this.scrolling)
      container.scrollTop = container.scrollHeight;
  },
  methods: {
    // send message
    sendMessage() {
      const message = {
        date: new Date().getTime(),
        text: this.text,
        uid: this.uid,
        roomName: this.joinedRoom,
        author: this.username,
      };
      this.messages = this.messages.concat(message); // show message in my client
      this.socketInstance.emit("message", message); // send message to others
      this.text = ""; // intialize input
      this.inFilesTabView = false;
    },
    async refreshFiles() {
      const isProd = process.env.NODE_ENV === "production";
      const url =
        (isProd
          ? "https://quickchat-api-61040.herokuapp.com/"
          : "http://localhost:3000/") +
        `api/chatRooms?keyword=${this.joinedRoom}`;
      const r = await fetch(url);
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      this.files = res.files;
    },
    async handleFileUpload(e) {
      // functionality for uploading files could be added here
      e.preventDefault();
      const data = new FormData(e.target);
      const isProd = process.env.NODE_ENV === "production";
      const url = isProd
        ? "https://quickchat-api-61040.herokuapp.com"
        : "http://localhost:3000";
      const res = await fetch(`${url}/api/chatRooms/${this.roomId}/files`, {
        method: "POST",
        body: data,
      });
      if (res.status != 201) {
        this.$store.commit("alert", {
          message: (await res.json()).err,
          status: "error",
        });
        return;
      }
      this.socketInstance.emit("fileChange", { roomName: this.joinedRoom });
      this.refreshFiles();
      this.inFilesTabView = true;
    },
    async handleFileDownload(id, filename) {
      // functionality for uploading files could be added here
      const isProd = process.env.NODE_ENV === "production";
      const url = isProd
        ? "https://quickchat-api-61040.herokuapp.com"
        : "http://localhost:3000";
      const res = await fetch(`${url}/api/files/${id}`);
      if (res.status != 200) {
        this.$store.commit("alert", {
          message: (await res.json()).err,
          status: "error",
        });
        return;
      }
      const data = await res.blob();
      const blob = new Blob([data], { type: "application/octet-stream" });
      // blob.type = "application/octet-stream";
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(blob, filename);
        return;
      }
      const blobURL = window.URL.createObjectURL(blob);
      const tempLink = document.createElement("a");
      tempLink.style.display = "none";
      tempLink.href = blobURL;
      tempLink.setAttribute("download", filename);
      if (typeof tempLink.download === "undefined") {
        tempLink.setAttribute("target", "_blank");
      }
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(blobURL);
      }, 100);
    },
    changeName(e) {
      e.preventDefault();
      const newUsername = e.target[0].value;
      this.username = newUsername;
      this.socketInstance.emit("username", {
        chatroomKey: this.joinedRoom,
        uid: this.uid,
        newUsername: newUsername,
      }); // send new name to others

      setUsername(newUsername);
      this.updateNameInMessages(this.uid, newUsername);
      this.$store.commit("alert", {
        message: "Successfully updated username",
        status: "success",
      });
    },
    handleKeypress(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    },
    updateNameInMessages(uid, newUsername) {
      this.messages = this.messages.map((message) => {
        if (message.uid === uid) {
          return {
            ...message,
            username: newUsername,
            author: newUsername,
          };
        }
        return message;
      });
    },
    voteConfused() {
      // Emit Confused Reaction
      const confusedVote = {
        reaction: "confused",
        uid: localStorage.uid,
        chatroomKey: this.joinedRoom,
      };
      this.socketInstance.emit("confusedVote", confusedVote); // send confused vote to others

      if (this.userVotedConfused) {
        this.confusedCount -= 1;
      } else {
        this.confusedCount += 1;
      }
      this.userVotedConfused = !this.userVotedConfused;
    },
    async voteHappy() {
      // Emit Happy Reaction
      const happyVote = {
        reaction: "happy",
        uid: localStorage.uid,
        chatroomKey: this.joinedRoom,
      };
      this.socketInstance.emit("happyVote", happyVote); // send happy vote to others

      if (this.userVotedHappy) {
        this.happyCount -= 1;
      } else {
        this.happyCount += 1;
      }
      this.userVotedHappy = !this.userVotedHappy;
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
      const groupVibesCountURL =
        (isProd
          ? "https://quickchat-api-61040.herokuapp.com/"
          : "http://localhost:3000/") +
        `api/groupVibes?keyword=${this.joinedRoom}`;

      try {
        const r = await fetch(url, {
          method: "GET",
          headers: { chatPassword: "" },
          type: "application/json",
        });
        // const r = await fetchFromApi(`/chatRooms?keyword=${room}`, "GET");
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.messages = res.messages;
        this.files = res.files;
        this.roomId = res._id;
      } catch (e) {
        console.log("Could not fetch messages:", e);
        this.$store.commit("alert", {
          message: `Chat "${this.joinedRoom}" not found`,
          status: "error",
        });
        this.$router.push({ name: "home" });
      }

      // Getting Initial Group Vibe Counts
      try {
        const r = await fetch(groupVibesCountURL);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.happyCount = res.happy;
        this.confusedCount = res.confused;
      } catch (e) {
        console.log("Could not fetch counts for group vibe:", e);
        this.happyCount = 0;
        this.confusedCount = 0;
      }
    },
    leaveRoom() {
      this.socketInstance.emit("leave-room", {
        roomName: this.joinedRoom,
      });
      this.joinedRoom = "";
      this.$router.push("/");
    },
    handleScroll(e) {
      //Check if user is scrolling, if so we don't want to autoscroll to bottom on new messages received.
      //If they scroll to bottom, auto scroll on new events again.
      if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) {
        this.scrolling = false;
      } else {
        this.scrolling = true;
      }
    },
    changeToChat() {
      this.inFilesTabView = false;
    },
    changeToFiles() {
      this.inFilesTabView = true;
    },
  },
};
</script>
