let todos = getSavedTodos();

const filters = {
  searchText: ""
};

function getSavedTodos() {
  const todosJSON = localStorage.getItem("todos");

  if (todosJSON !== null) {
    return JSON.parse(todosJSON);
  } else {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

const renderTodos = function(todos, filters) {
  const filteredTodos = todos.filter(function(todo) {
    return todo.text.toLowerCase().includes(filters.searchText.toLowerCase());
  });

  const incompleteTodos = filteredTodos.filter(function(todo) {
    return !todo.completed;
  });

  document.querySelector("#todos").innerHTML = "";

  const summary = document.createElement("h2");
  summary.textContent = `You have ${incompleteTodos.length} todos left`;
  document.querySelector("#todos").appendChild(summary);

  filteredTodos.forEach(function(todo) {
    let todoItem = generateTodoItem(todo);
    document.querySelector("#todos").appendChild(todoItem);
  });
};

function generateTodoItem(todo) {
  const newTodo = document.createElement("p");
  if (todo.completed) {
    newTodo.classList.add("completed");
  }
  newTodo.textContent = todo.text;
  newTodo.setAttribute("id", todo.id);
  let removeButton = generateRemoveButton();
  newTodo.appendChild(removeButton);
  newTodo.addEventListener("click", completeTodo);
  return newTodo;
}

function completeTodo(event) {
  let todoId = event.target.getAttribute("id");
  for (let index = 0; index < todos.length; index++) {
    if (todos[index].id == todoId) {
      todos[index].completed = true;
    }
  }
  renderTodos(todos, filters);
}

function generateRemoveButton() {
  let spanElement = document.createElement("SPAN");
  spanElement.textContent = "remove";
  spanElement.className = "close";
  spanElement.onclick = function() {
    var parrentElement = this.parentElement;
    removeTodo(parrentElement.getAttribute("id"));
    renderTodos(todos, filters);
  };

  return spanElement;
}

function removeTodo(id) {
  for (let index = 0; index < todos.length; index++) {
    if (todos[index].id == id) {
      todos.splice(index, 1);
      localStorage.removeItem("todos");
    }
  }
}

renderTodos(todos, filters);

document.querySelector("#search-text").addEventListener("input", function(e) {
  filters.searchText = e.target.value;
  renderTodos(todos, filters);
});

const addBtn = document.querySelector("#add-btn");
const delBtn = document.querySelector("#del-btn");
const todoInput = document.querySelector("#add-todo");

addBtn.addEventListener("click", function(e) {
  e.preventDefault();
  if (todoInput.value === "") {
    alert("Please write something to do...");
  } else {
    todos.push({
      id: Math.floor(Math.random(10) * 1000),
      text: todoInput.value,
      completed: false
    });
  }
  renderTodos(todos, filters);
  todoInput.value = "";

  saveTodos(todos);
});

delBtn.addEventListener("click", function(e) {
  e.preventDefault();
  todos = [];
  localStorage.clear();
  renderTodos(todos, filters);
});
