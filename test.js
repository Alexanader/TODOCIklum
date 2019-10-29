const show = (state) => {
    document.querySelector('.window').style.display = state;
    document.querySelector('.filter').style.display = state;
}

let todoItems = [];

function OnSearch (input) {
            alert ("The current value of the search field is\n" + input.value);
        }


const resetForm = () => {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
}

const newElement = () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const formPriority = document.getElementById("priority")
    const selectedPriority = formPriority.options[formPriority.selectedIndex].value

    if (title === '') {
        alert("You must write something!");
    } else {
        addTodo(title, description, selectedPriority)
        show('none')
    }

    resetForm()
}

const getCheckedItem = (key) => {
    const index = todoItems.findIndex(item => item.id === Number(key));
    todoItems[index].checked = !todoItems[index].checked;

    const item = document.querySelector(`[data-key='${key}']`);
    return {index, item}
}

const toggleDone = (key) => {
    const {index, item} = getCheckedItem(key);
    if (todoItems[index].checked) {
        item.classList.add('done');
    } else {
        item.classList.remove('done');
    }
};

const deleteTodo = (key) => {
    todoItems = todoItems.filter(item => item.id !== Number(key));
    const item = document.querySelector(`[data-key='${key}']`);
    item.remove();
};

const editTask = (key) => {
    const {index, item} = getCheckedItem(key);

    const editTitle = item.querySelector('#todo-input-title');
    const editDescription = item.querySelector('#todo-input-description');

    const labelTitle = item.querySelector("#todo-label-title");
    const labelDescription = item.querySelector("#todo-label-description");
    const isEditEnable = item.classList.contains("editMode");

    if (isEditEnable) {
        labelTitle.innerText = editTitle.value;
        todoItems[index].title = editTitle.value;
        labelDescription.innerText = editDescription.value;
        todoItems[index].description = editDescription.value;
    } else {
        editTitle.value = labelTitle.innerText;
        editDescription.value = labelDescription.innerText;
    }

    item.classList.toggle("editMode");
}

const addTodo = (title, description, priority) => {
    const todo = {
        title,
        description,
        priority,
        checked: false,
        id: Date.now(),
    };
    todoItems.push(todo);

    const list = document.querySelector('#list');
    list.insertAdjacentHTML('beforeend', `
    <div class = 'todo-item show' data-key="${todo.id}">
          <div><p>Title</p>
              <label id="todo-label-title">${todo.title}</label>
              <input id="todo-input-title" type='text' value = '${todo.title}'>
          </div>
          <div><p>Description</p>
              <label id="todo-label-description">${todo.description}</label>
              <input id="todo-input-description" type='text' value = '${todo.description}'>
          </div>
          <div class = 'todo-priority'>${todo.priority}</div>
            <button  onclick = "toggleDone(${todo.id})" class="button-todo js-done-todo">
              Done
            </button>
            <button onclick = "deleteTodo(${todo.id})" for="${todo.id}" class="button-todo js-delete-todo">
              Delete
            </button>
            <button onclick = "editTask(${todo.id})" class = "button-todo js-edit-todo">
                Edit
            </button>
      </div>`);
}


const sortBy = () => {
    const complicitySelect = document.getElementById("complicitySelect");
    const prioritySelect = document.getElementById("prioritySelect");
    const searchInput = document.getElementById("Search").value;
    const searchTitle = new RegExp(searchInput, 'i');
    const priority = prioritySelect.options[prioritySelect.selectedIndex].value;
    const complicity = complicitySelect.options[complicitySelect.selectedIndex].value;
    return sort(priority, complicity, searchTitle)
}

const sort = (priority, complicity, searchTitle) => {
    let checked = complicity === 'done'
    let showItems = todoItems.filter(item => searchTitle.test(item.title))
    showItems = showItems
        .filter(item => priority === 'all' || item.priority === priority)
        .filter(item => complicity === 'all' || item.checked === checked)
    return renderSortedTodos(showItems)
}

const renderSortedTodos = (items) => {
    items.forEach(todo => {
        const item = document.querySelector(`[data-key='${todo.id}']`);
        item.classList.add('show');
        item.classList.remove('hide');
    })

    todoItems.filter(item => !items.includes(item)).forEach(todo => {
        const item = document.querySelector(`[data-key='${todo.id}']`);
        item.classList.add('hide');
        item.classList.remove('show');
    })
}
