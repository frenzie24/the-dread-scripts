// controlls interaction between server and newBlogItem view

// handles adding a new blog item


class BlogItemController {
    constructor(selector, isPost) {



        this.postId = selector;
        this.selector = `blogItemFormPost${selector}` + (!isPost ? `Comment` : ``);

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
                    })
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

                         //   if (res.redirected) res.redirect();
                            res.json().then(res => console.log(res))
                            // document.location.replace('/profile');
                            debugger;
                        } else {
                            alert(res.statusText);
                        }
                    });
                }
            }



            debugger;
            console.log('add btn clicked');
        }
        $(`#${this.selector} #addBtn`).on('click', handleAdd);


    }

}

