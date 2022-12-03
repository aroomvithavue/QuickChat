/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 */
  
  function viewGroupVibeByKeyword(fields) {
    fetch(`/api/groupVibes?keyword=${fields.key}`)
      .then(showResponse)
      .catch(showResponse);
  }
  
  function addReactionToGroupVibe(fields) {
    fetch(`/api/groupVibes`, {method: 'PATCH', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function deleteGroupVibe(fields) {
    fetch(`/api/groupVibes/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }