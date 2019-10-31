const show = (state) => {
    document.querySelector('.window').style.display = state;
    document.querySelector('.filter').style.display = state;
}

let todoItems = [];
let isChanged = new Set();


// function onSearch = (input) => {
//             alert ("The current value of the search field is\n" + input.value);
//         }


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
        let todoItemNew = {title:title, description:description, priority:selectedPriority};
        addTodo(todoItemNew);
        show('none')
    }

    resetForm()
}

const getCheckedItem = (key) => {
    const index = todoItems.findIndex(item => item.id === Number(key));
    const wrapper = document.querySelector(`[data-key='${key}']`);
    return {index, wrapper}
}

const toggleDone = (key) => {
    const {index, wrapper} = getCheckedItem(key);

    todoItems[index].checked = !todoItems[index].checked;
    
    isChanged.add(todoItems[index].id);

    if (todoItems[index].checked) {
        wrapper.classList.add('done');
    } else {
        wrapper.classList.remove('done');
    }
};

const deleteTodo = (key) => {
    todoItems = todoItems.filter(item => item.id !== Number(key));
    
    const wrapper = document.querySelector(`[data-key='${key}']`);
    wrapper.remove();
    
    sessionStorage.removeItem(key)
};

const editTask = (key) => {
    const {index, wrapper} = getCheckedItem(key);

    const editTitle = wrapper.querySelector('#todo-input-title');
    const editDescription = wrapper.querySelector('#todo-input-description');
    const labelTitle = wrapper.querySelector("#todo-label-title");
    const labelDescription = wrapper.querySelector("#todo-label-description");
    const labelPriority = wrapper.querySelector("#todo-label-priority");
    const formPriority = wrapper.querySelector("#todo-edit-priority");
    const editPriority = formPriority.options[formPriority.selectedIndex].value;
    console.log(editPriority)
    const isEditEnable = wrapper.classList.contains("editMode");

    if (isEditEnable) {
        labelTitle.innerText = editTitle.value;
        todoItems[index].title = editTitle.value;
        labelDescription.innerText = editDescription.value;
        todoItems[index].description = editDescription.value;
        labelPriority.innerText = editPriority;
        todoItems[index].priority = editPriority;


        isChanged.add(todoItems[index].id);
    } else {
        editTitle.value = labelTitle.innerText;
        editDescription.value = labelDescription.innerText;
        editPriority.value = formPriority.innerText;
    }

    wrapper.classList.toggle("editMode");
}

const addTodo = (todoItem) => {
    let todo = {
        title: todoItem.title,
        description: todoItem.description,
        priority: todoItem.priority,
        id: todoItem.id ? todoItem.id : Date.now(),
        checked: todoItem.checked ? true : false,
    };

    todoItems.push(todo);    

    const list = document.querySelector('#list');
    list.insertAdjacentHTML('beforeend', 
        `<div class ='todo-item show ${todo.checked ? 'done' : ''}' data-key="${todo.id}">
            <div><p>Title</p>
                <label id="todo-label-title">${todo.title}</label>
                <input id="todo-input-title" type='text' value = '${todo.title}'>
            </div>
            <div>
                <p>Description</p>
                <label id="todo-label-description">${todo.description}</label>
                <input id="todo-input-description" type='text' value = '${todo.description}'>
            </div>
            <div class = 'todo-priority'><label id="todo-label-priority">${todo.priority}</label></div>
            <div class="selection-tab">
            <select id ='todo-edit-priority'>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
            </select>
            </div>
            <button onclick ="toggleDone(${todo.id})" class="button-todo js-done-todo">
                Done
            </button>
            <button onclick="deleteTodo(${todo.id})" for="${todo.id}" class="button-todo js-delete-todo">
              Delete
            </button>
            <button onclick="editTask(${todo.id})" class="button-todo js-edit-todo">
                Edit
            </button>
        </div>`
    );
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


window.onbeforeunload = () => {
    todoItems.forEach(todoItem => {
        let todoItemId = todoItem.id;

        if (!sessionStorage.getItem(todoItemId)) {
            sessionStorage.setItem(todoItemId, JSON.stringify(todoItem));
        } else if (isChanged.has(todoItemId)) {
            sessionStorage.setItem(todoItemId, JSON.stringify(todoItem));  
        }
    });
};


for (let i = 0, ssLength = sessionStorage.length; i < ssLength; i++) {
    let
        key = sessionStorage.key(i),
        todoItem = JSON.parse(sessionStorage.getItem(key));

    addTodo(todoItem)
}