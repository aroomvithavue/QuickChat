<template>
  <main>
    <h1>
      This is home view for the path / (likely the chat joining or generating
      page stuff). Go to /chat for the chat view and /about for the about view
    </h1>

    <center>
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Create Chat</h2>
          <p>Duration</p>
          <div class="card-actions justify-end">
            <a href="#/chat" class="link link-primary"
              ><button class="btn btn-primary">Generate Chat</button></a
            >
          </div>
        </div>
      </div>

      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Join Chat</h2>
          <p>Keyword</p>
          <div class="card-actions justify-end">
            <a href="#/chat" class="link link-primary"
              ><button class="btn btn-primary">Join Chat</button></a
            >
          </div>
        </div>
      </div>
      <a href="#/about" class="link link-primary">
        <button class="btn btn-primary">About QuickChat</button></a
      >
    </center>
  </main>
</template>
