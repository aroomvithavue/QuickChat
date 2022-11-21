function signIn(fields) {
  showResponse(new Response({ status: 200, statusText: "Succes" }));
  // fetch('/api/users/session', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
  //   .then(showResponse)
  //   .catch(showResponse);
}
