import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

const todoBtn = document.getElementById('todo-btn')
const todoInput = document.getElementById('todo-input')
const todosList = document.getElementById('todos-list')

const storedTodosJSON = () => {
  const todosJSON = localStorage.getItem('todos')
  return todosJSON ? JSON.parse(todosJSON) : []
}

const renderAllTodos = () => {
  const todos = storedTodosJSON()
  todos.forEach((todo) => {
    renderTodo(todo)
  })
}

const renderTodo = (todo) => {
  const todoDiv = document.createElement('div')
  const todoText = document.createElement('p')
  const btnContainer = document.createElement('div')
  const deleteBtn = document.createElement('button')
  const editBtn = document.createElement('button')

  todoDiv.classList.add('todo-item')
  todoDiv.setAttribute(`data-uuid`, todo.id)

  btnContainer.classList.add('btn-container')

  todoText.textContent = todo.task

  deleteBtn.textContent = 'delete'
  deleteBtn.classList.add('delete-btn')

  editBtn.textContent = 'edit todo'
  editBtn.classList.add('edit-btn')

  todoDiv.appendChild(todoText)
  btnContainer.appendChild(editBtn)
  btnContainer.appendChild(deleteBtn)
  todoDiv.appendChild(btnContainer)
  todosList.prepend(todoDiv)
}

const saveTodos = () => {
  const todos = storedTodosJSON()

  const newTodo = { id: uuidv4(), task: todoInput.value, isComplete: false }

  renderTodo(newTodo)

  todos.unshift(newTodo)

  const updatedTodos = JSON.stringify(todos)

  localStorage.setItem('todos', updatedTodos)

  todoInput.value = ''
}

const handleAddTodo = (e) => {
  if (todoInput.value && e.target === todoBtn) {
    saveTodos()
  }
}

const handleTodoChange = (e) => {
  if (
    e.target.classList.contains('delete-btn') ||
    e.target.classList.contains('edit-btn')
  ) {
    const todoDiv = e.target.closest('.todo-item')
    const btnContainer = e.target.closest('.btn-container')
    const todoText = btnContainer.previousElementSibling
    const todoId = todoDiv.getAttribute('data-uuid')
    let todos = storedTodosJSON()

    if (e.target.classList.contains('delete-btn')) {
      todos = todos.filter((todo) => todo.id !== todoId)

      localStorage.setItem('todos', JSON.stringify(todos))
      todosList.removeChild(todoDiv)
    }

    if (e.target.classList.contains('edit-btn')) {
      e.target.disabled = true

      const placeholderText = todoText.textContent

      todoDiv.removeChild(todoText)

      const todoInput = document.createElement('input')
      const saveBtn = document.createElement('button')

      saveBtn.textContent = 'save'
      saveBtn.classList.add('save-btn')
      todoInput.placeholder = placeholderText

      todoDiv.insertBefore(todoInput, todoDiv.firstChild)
      todoDiv.insertBefore(saveBtn, todoDiv.lastChild)

      saveBtn.addEventListener('click', () => {
        const updatedTodo = todoInput.value
        todoText.textContent = updatedTodo || placeholderText
        todoDiv.removeChild(todoInput)
        todoDiv.removeChild(saveBtn)
        todoDiv.insertBefore(todoText, btnContainer)
        e.target.disabled = false

        todos = todos.map((todo) => {
          if (todo.id === todoId) {
            return { ...todo, task: updatedTodo }
          }
          return todo
        })
        localStorage.setItem('todos', JSON.stringify(todos))
      })
    }
  }
}

document.addEventListener('DOMContentLoaded', renderAllTodos)
todoBtn.addEventListener('click', handleAddTodo)
todosList.addEventListener('click', handleTodoChange)
