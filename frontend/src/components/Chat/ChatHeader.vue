<template>
  <main>
    <div class="tabs">
      <div class="mx-auto">
        <a
          @click="switchToChat"
          :class="`tab tab-bordered ${filesTabView ? '' : 'tab-active'}`"
        >
          Chat
        </a>
        <a
          @click="switchToFiles"
          :class="`tab tab-bordered ${filesTabView ? 'tab-active' : ''}`"
        >
          Files
        </a>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "ChatHeader",
  components: {},
  props: {
    filesTabView: {
      type: Boolean,
      required: true,
    },
  },
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
