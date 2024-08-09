import { v4 as uuidv4 } from 'https://jspm.dev/uuid'
import {
  storedTodosJSON,
  getTodoId,
  deleteTodoFromLocalStorage,
  createTodoInput,
  createSaveBtn,
  replaceTextWithInput,
  updateTodoText,
  updateTodoInStorage,
} from './helpers.js'

const todoBtn = document.getElementById('todo-btn')
const todoInput = document.getElementById('todo-input')
const todosList = document.getElementById('todos-list')

export const removeTodoFromDOM = (todoDiv) => {
  todosList.removeChild(todoDiv)
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

const handleTodoClick = (e) => {
  if (e.target.classList.contains('delete-btn')) {
    handleDeleteTodo(e)
  } else if (e.target.classList.contains('edit-btn')) {
    handleEditTodo(e)
  }
}

const handleDeleteTodo = (e) => {
  const todoDiv = e.target.closest('.todo-item')
  const todoId = getTodoId(todoDiv)
  deleteTodoFromLocalStorage(todoId)
  removeTodoFromDOM(todoDiv)
}
const handleEditTodo = (e) => {
  const todoDiv = e.target.closest('.todo-item')
  const btnContainer = e.target.closest('.btn-container')
  const todoText = btnContainer.previousElementSibling
  const todoId = getTodoId(todoDiv)
  setupEditMode(todoDiv, todoText, todoId)
  e.target.disabled = true
}

const setupEditMode = (todoDiv, todoText, todoId) => {
  const placeholderText = todoText.textContent
  const todoInput = createTodoInput(placeholderText)
  const saveBtn = createSaveBtn()
  replaceTextWithInput(todoDiv, todoText, todoInput, saveBtn)

  saveBtn.addEventListener('click', () => {
    handleSaveEdit(todoDiv, todoText, todoInput, saveBtn, todoId)
  })
}

const handleSaveEdit = (todoDiv, todoText, todoInput, saveBtn, todoId) => {
  const updatedTodo = todoInput.value ? todoInput.value : todoInput.placeholder
  const editBtn = todoDiv.lastChild.firstChild

  updateTodoText(todoDiv, todoText, todoInput, saveBtn, updatedTodo)
  updateTodoInStorage(todoId, updatedTodo)
  editBtn.disabled = false
}

document.addEventListener('DOMContentLoaded', renderAllTodos)
todoBtn.addEventListener('click', handleAddTodo)
todosList.addEventListener('click', handleTodoClick)

// Helper Functions
// const getTodoId = (todoDiv) => todoDiv.getAttribute('data-uuid')

// const deleteTodoFromLocalStorage = (todoId) => {
//   let todos = storedTodosJSON()
//   todos = todos.filter((todo) => todo.id !== todoId)
//   localStorage.setItem('todos', JSON.stringify(todos))
// }

// const removeTodoFromDOM = (todoDiv) => {
//   todosList.removeChild(todoDiv)
// }

// const createTodoInput = (placeholderText) => {
//   const todoInput = document.createElement('input')
//   todoInput.placeholder = placeholderText
//   return todoInput
// }

// const createSaveBtn = () => {
//   const saveBtn = document.createElement('button')
//   saveBtn.textContent = 'save'
//   saveBtn.classList.add('save-btn')
//   return saveBtn
// }

// const replaceTextWithInput = (todoDiv, todoText, todoInput, saveBtn) => {
//   todoDiv.removeChild(todoText)
//   todoDiv.insertBefore(todoInput, todoDiv.firstChild)
//   todoDiv.insertBefore(saveBtn, todoDiv.lastChild)
// }

// const updateTodoText = (todoDiv, todoText, todoInput, saveBtn, updatedTodo) => {
//   todoText.textContent = updatedTodo || todoInput.placeholder
//   todoDiv.removeChild(todoInput)
//   todoDiv.removeChild(saveBtn)
//   todoDiv.insertBefore(todoText, todoDiv.querySelector('.btn-container'))
// }

// const updateTodoInStorage = (todoId, updatedTodo) => {
//   let todos = storedTodosJSON()
//   todos = todos.map((todo) => {
//     if (todo.id === todoId) {
//       return { ...todo, task: updatedTodo }
//     }
//     return todo
//   })
//   localStorage.setItem('todos', JSON.stringify(todos))
// }

// const handleTodoChange = (e) => {
//   if (
//     e.target.classList.contains('delete-btn') ||
//     e.target.classList.contains('edit-btn')
//   ) {
//     const todoDiv = e.target.closest('.todo-item')
//     const btnContainer = e.target.closest('.btn-container')
//     const todoText = btnContainer.previousElementSibling
//     const todoId = todoDiv.getAttribute('data-uuid')
//     let todos = storedTodosJSON()

//     if (e.target.classList.contains('delete-btn')) {
//       deleteTodoFromLocalStorage(todoId)
//       removeTodoFromDOM(todoDiv)
//     }

//     if (e.target.classList.contains('edit-btn')) {
//       e.target.disabled = true

//       const placeholderText = todoText.textContent

//       todoDiv.removeChild(todoText)

//       const todoInput = document.createElement('input')
//       const saveBtn = document.createElement('button')

//       saveBtn.textContent = 'save'
//       saveBtn.classList.add('save-btn')
//       todoInput.placeholder = placeholderText

//       todoDiv.insertBefore(todoInput, todoDiv.firstChild)
//       todoDiv.insertBefore(saveBtn, todoDiv.lastChild)

//       saveBtn.addEventListener('click', () => {
//         const updatedTodo = todoInput.value
//         todoText.textContent = updatedTodo || placeholderText
//         todoDiv.removeChild(todoInput)
//         todoDiv.removeChild(saveBtn)
//         todoDiv.insertBefore(todoText, btnContainer)
//         e.target.disabled = false

//         todos = todos.map((todo) => {
//           if (todo.id === todoId) {
//             return { ...todo, task: updatedTodo }
//           }
//           return todo
//         })
//         localStorage.setItem('todos', JSON.stringify(todos))
//       })
//     }
//   }
// }
