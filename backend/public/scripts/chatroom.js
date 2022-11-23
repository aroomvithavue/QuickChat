/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 */

 function viewAllChatRooms(fields) {
  fetch('/api/chatRooms')
    .then(showResponse)
    .catch(showResponse);
}

function viewChatRoomByKeyword(fields) {
  fetch(`/api/chatRooms?keyword=${fields.key}`)
    .then(showResponse)
    .catch(showResponse);
}

function createChatRoom(fields) {
  fetch('/api/chatRooms', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function addMessageToChatRoom(fields) {
  fetch(`/api/chatRooms/${fields.id}`, {method: 'PATCH', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteChatRoom(fields) {
  fetch(`/api/chatRooms/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
