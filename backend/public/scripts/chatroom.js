/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 */

function viewAllChatRooms(fields) {
  fetch("/api/chatRooms").then(showResponse).catch(showResponse);
}

function viewChatRoomByKeyword(fields) {
  fetch(`/api/chatRooms?keyword=${fields.key}`)
    .then(showResponse)
    .catch(showResponse);
}

function createChatRoom(fields) {
  fetch("/api/chatRooms", {
    method: "POST",
    body: JSON.stringify(fields),
    headers: { "Content-Type": "application/json" },
  })
    .then(showResponse)
    .catch(showResponse);
}

function addFile(fields) {
  const file = fields.filename;
  console.log(file);
  const data = new FormData();

  data.set("file", file);
  // data.set("chatId", fields.id);
  fetch(`/api/chatRooms/${fields.id}/files`, {
    method: "POST",
    body: data,
    // headers: { "Content-Type": "multipart/form-data" },
  })
    .then(showResponse)
    .catch(showResponse);
}

function addMessageToChatRoom(fields) {
  fetch(`/api/chatRooms/${fields.id}`, {
    method: "PATCH",
    body: JSON.stringify(fields),
    headers: { "Content-Type": "application/json" },
  })
    .then(showResponse)
    .catch(showResponse);
}

function deleteChatRoom(fields) {
  fetch(`/api/chatRooms/${fields.id}`, { method: "DELETE" })
    .then(showResponse)
    .catch(showResponse);
}
