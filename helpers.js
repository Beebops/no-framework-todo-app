export const storedTodosJSON = () => {
  const todosJSON = localStorage.getItem('todos')
  return todosJSON ? JSON.parse(todosJSON) : []
}

export const getTodoId = (todoDiv) => todoDiv.getAttribute('data-uuid')

export const deleteTodoFromLocalStorage = (todoId) => {
  let todos = storedTodosJSON()
  todos = todos.filter((todo) => todo.id !== todoId)
  localStorage.setItem('todos', JSON.stringify(todos))
}

export const createTodoInput = (placeholderText) => {
  const todoInput = document.createElement('input')
  todoInput.placeholder = placeholderText
  return todoInput
}

export const createSaveBtn = () => {
  const saveBtn = document.createElement('button')
  saveBtn.textContent = 'save'
  saveBtn.classList.add('save-btn')
  return saveBtn
}

export const replaceTextWithInput = (todoDiv, todoText, todoInput, saveBtn) => {
  todoDiv.removeChild(todoText)
  todoDiv.insertBefore(todoInput, todoDiv.firstChild)
  todoDiv.insertBefore(saveBtn, todoDiv.lastChild)
}

export const updateTodoText = (
  todoDiv,
  todoText,
  todoInput,
  saveBtn,
  updatedTodo
) => {
  todoText.textContent = updatedTodo || todoInput.placeholder
  todoDiv.removeChild(todoInput)
  todoDiv.removeChild(saveBtn)
  todoDiv.insertBefore(todoText, todoDiv.querySelector('.btn-container'))
}

export const updateTodoInStorage = (todoId, updatedTodo) => {
  let todos = storedTodosJSON()
  todos = todos.map((todo) => {
    if (todo.id === todoId) {
      return { ...todo, task: updatedTodo }
    }
    return todo
  })
  localStorage.setItem('todos', JSON.stringify(todos))
}
