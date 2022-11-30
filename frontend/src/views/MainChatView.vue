<template>
  <main>
    <Chat />
    <SidebarView />
  </main>
</template>

<script>
import Chat from "@/components/Chat/Chat.vue";
import SidebarView from "@/components/Chat/Sidebar.vue";

export default {
  name: "MainChat",
  components: {
    Chat,
    SidebarView,
  },
};
</script>
