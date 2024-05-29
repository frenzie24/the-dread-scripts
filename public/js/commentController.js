class CommentController {
  constructor(id) {
    const deleteComment = async (ev) => {
      ev.preventDefault();
      if (ev.target.hasAttribute('data-id')) {
        const id = ev.target.getAttribute('data-id');

        const response = await fetch(`/api/comments/${id}`, {
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
      $(`#deleteCommentBtn${id}`).on('click', deleteComment);
    })
  }
}

