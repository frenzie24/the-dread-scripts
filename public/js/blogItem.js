// controlls interaction between server and newBlogItem view

// handles adding a new blog item


class BlogItemController {
    constructor(selector, isPost) {




        selector = `blogItemFormPost${selector}` + (!isPost ? `Comment` : ``);

        const handleAdd = async (ev) => {
            ev.preventDefault();
            console.log('add btn clicked');
        }
        $(`#${selector} #addBtn`).on('click', handleAdd);


    }

}

