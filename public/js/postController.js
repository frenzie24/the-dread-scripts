class PostController {
  constructor(id, user_id) {
    // store the path of the next image in toggle (page starts on edit btn)
    this.nextImgSrc = '../assets/images/icons8-save-48.png';
    this.id = id;
    this.user_id = user_id;
    //store the enabled state
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

    const updatePost = async () => {


      let update = {
        user_id: this.user_id,
        id: this.id,
        title: $('#titleInput').val(),
        content: $('#postContent').val(),
      }
      if (update) {
        const response = await fetch(`/post/?id=${this.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ ...update }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          // updating worked, nav to profile
          console.log('it worked?');
        } else {
          alert(response.statusText);
        }
      }
    }

    const handleEditToggle = async (ev) => {
      ev.preventDefault();
      $('#titleLink').toggle();
      $('#titleInput').toggle();

      let content = $('#postContent');
      // $('#')
      let img = $('#postEditImg');

      // toggle content disabled state by negating its current disabled state with !
      // Ur NoT nOt DiSaBlEd, CoNtEnT!
      content.prop("disabled", !content.prop("disabled"));
      // if content was input was just disabled, we just finished editing so send the update to the server
      if (content.prop('disabled')) await updatePost()
      // store the current value of img's src
      let currImgSrc = img.attr('src');
      img.attr('src', this.nextImgSrc);
      this.nextImgSrc = currImgSrc;

    }

    $(() => {
      $(`#deletePostBtn${id}`).on('click', deletePost);
      $(`#editPostBtn`).on('click', handleEditToggle);
      $('#')
    })
  }
}

