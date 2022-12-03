<template>
  <main>
    <div
      class="text-sm font-medium text-black-500 dark:text-gray-400 dark:border-gray-700"
    >
      <ul class="flex flex-wrap -mb-px items-center justify-center">
        <li class="mr-2">
          <button
            @click="switchToChat"
            class="inline-block p-4 rounded-t-lg border-b-2 border-gray-200 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
          >
            Chat
          </button>
        </li>
        <li class="mr-2">
          <button
            @click="switchToFiles"
            class="inline-block p-4 rounded-t-lg border-b-2 border-gray-200 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
          >
            Files
          </button>
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
export default {
  name: "ChatHeader",
  components: {},
  methods: {
    switchToChat() {
      this.$emit("switchToChat");
    },
    switchToFiles() {
      this.$emit("switchToFiles");
    },
  },
};
</script>
