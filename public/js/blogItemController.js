// controlls interaction between server and newBlogItem view

// handles adding a new blog item


class BlogItemController {
    constructor(selector, isPost) {



        this.postId = selector;
        this.selector = `blogItemFormPost${selector}` + (!isPost ? `Comment` : ``);

        const deletePost = async (ev) => {
            ev.preventDefault();
            if (ev.currentTarget.hasAttribute('data-id')) {
                const id = ev.currentTarget.getAttribute('data-id');

                const response = await fetch(`/api/posts/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    location.replace('/dashboard')
                } else {
                    debugger;
                    document.location.replace('/dashboard')// = response.url;
                    //   alert('Failed to delete plant');
                }
            }
        }

        const deleteComment = async (ev) => {
            ev.preventDefault();
            if (ev.currentTarget.hasAttribute('data-id')) {
                const id = ev.currentTarget.getAttribute('data-id');

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

        const handleAdd = async (ev) => {
            ev.preventDefault();
            // select this blog items title and content element and get and trim their value
            // only get title if this is a post and not a comment
            let url = '/api/'

            if (isPost) {
                url += 'posts/'

                let Post = {
                    content: $(`#${this.selector} #content`).val().trim(),
                    title: $(`#${this.selector} #title`).val().trim(),

                }

                if (Post.content != '') {
                    await fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(Post),
                        headers: { 'Content-Type': 'application/json' },
                    }).then((res) => {
                        if (res.ok) {
                            location.reload(true);
                            debugger;
                        } else {
                            alert(res.statusText);
                        }
                    });
                }

            } else {

                url += 'comments/';
                let content = $(`#${this.selector} #content`).val().trim();

                if (content != '') {
                    await fetch(url, {
                        method: 'POST',
                        body: JSON.stringify({ content: content, post_id: this.postId }),
                        headers: { 'Content-Type': 'application/json' },
                    }).then((res) => {
                        if (res.ok) {
                            location.reload(true);
                            
                        } else {
                            location.replace('./login');
                        }
                    });
                }
            }



            debugger;
            console.log('add btn clicked');
        }

        $(() => {

            $(`#${this.selector} #addBtn`).on('click', handleAdd);
          //  if (isPost) $(`#deletePostBtn${this.postId}`).on('click', deletePost)
             $(`#deleteCommentBtn${this.postId}`).on('click', deleteComment);

        })



    }

}

