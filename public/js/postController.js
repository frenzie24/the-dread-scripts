class PostController {
  constructor(id) {
    const deletePost = async (ev) => {
      ev.preventDefault();
      if (ev.target.hasAttribute('data-id')) {
        const id = ev.target.getAttribute('data-id');

        const response = await fetch(`/api/posts/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          location.reload(true);
        } else {
          debugger;
          document.location.href = response.url;
          //   alert('Failed to delete plant');
        }
      }
    }

    $(() => {
      $(`#deletePostBtn${id}`).on('click', deletePost);
    })
  }
}

