const logout = async () => {
  debugger
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (res.ok) {
      // if we logged out correctly, go to the homepage
      document.location.replace('/');
    } else {
      
      alert(res.statusText);
    }
  });
};
$(() => {
  $('#logoutBtn').on('click', logout);
});
//document.querySelector('#logoutBtn').addEventListener('click', logout);
