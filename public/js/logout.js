const logout = async () => {
  debugger
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }).then(() => {
    if (response.ok) {
      // if we logged out correctly, go to the homepage
      document.location.replace('/');
    } else {
      alert(response.statusText);
    }
  });
};
$(() => {
  $('#logoutBtn').on('click', logout);
});
//document.querySelector('#logoutBtn').addEventListener('click', logout);
