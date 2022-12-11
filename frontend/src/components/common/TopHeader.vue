<template>
  <div class="navbar bg-base-300 h-[5vh] my-0">
    <router-link to="/" class="btn btn-ghost normal-case text-xl text-primary"
      ><img
        class="max-w-full h-auto rounded-lg w-30 h-30"
        width="50"
        height="60"
        alt="QuickChat"
        src="../../assets/logo.png"
      />
    </router-link>
    <section class="absolute top-12 z-20 flex flex-col gap-1">
      <!-- dummy div to avoid purging styles -->
      <div class="hidden alert-error alert-success"></div>
      <!-- dummy div to avoid purging styles -->
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="'alert shadow-lg alert-' + status"
      >
        <svg
          v-if="status === 'success'"
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-if="status === 'error'"
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ alert }}</span>
      </article>
    </section>
  </div>
</template>
