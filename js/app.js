/**
 * NEXUS - Premium Task Management Application
 * Main Application JavaScript
 * 
 * This file contains the core functionality for the Nexus task management app,
 * including task management, habit tracking, notes, and timer functionality.
 */

// DOM Elements
const themeSwitch = document.getElementById('themeSwitch');
const settingsBtn = document.getElementById('settingsBtn');
const addTaskBtn = document.getElementById('addTaskBtn');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const filterBtn = document.getElementById('filterBtn');
const sortBtn = document.getElementById('sortBtn');
const tasksList = document.getElementById('tasksList');
const categoryList = document.getElementById('categoryList');

// Modals
const addTaskModal = document.getElementById('addTaskModal');
const addCategoryModal = document.getElementById('addCategoryModal');
const settingsModal = document.getElementById('settingsModal');
const closeTaskModal = document.getElementById('closeTaskModal');
const closeCategoryModal = document.getElementById('closeCategoryModal');
const closeSettingsModal = document.getElementById('closeSettingsModal');

// Forms
const addTaskForm = document.getElementById('addTaskForm');
const addCategoryForm = document.getElementById('addCategoryForm');

// Settings
const darkModeToggle = document.getElementById('darkModeToggle');
const notificationsToggle = document.getElementById('notificationsToggle');
const defaultViewSelect = document.getElementById('defaultView');

// State Management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [
  { id: 'all', name: 'All Tasks', icon: 'A', color: '#c7b299' },
  { id: 'work', name: 'Work', icon: 'W', color: '#4caf50' },
  { id: 'personal', name: 'Personal', icon: 'P', color: '#2196f3' },
  { id: 'shopping', name: 'Shopping', icon: 'S', color: '#ff9800' },
  { id: 'health', name: 'Health', icon: 'H', color: '#f44336' }
];
let currentCategory = 'all';
let currentSort = 'date';
let currentFilter = 'all';

// Initialize Application
function init() {
  loadTheme();
  renderTasks();
  renderCategories();
  setupEventListeners();
  setupSortable();
}

// Theme Management
function loadTheme() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  darkModeToggle.checked = isDarkMode;
}

function toggleTheme() {
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  localStorage.setItem('darkMode', !isDarkMode);
}

// Task Management
function addTask(task) {
  tasks.unshift({
    id: Date.now(),
    ...task,
    completed: false,
    createdAt: new Date().toISOString()
  });
  saveTasks();
  renderTasks();
  showToast('Task added successfully');
}

function updateTask(id, updates) {
  tasks = tasks.map(task => 
    task.id === id ? { ...task, ...updates } : task
  );
  saveTasks();
  renderTasks();
  showToast('Task updated');
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
  showToast('Task deleted');
}

function toggleTaskComplete(id) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    updateTask(id, { completed: !task.completed });
  }
}

// Category Management
function addCategory(category) {
  categories.push({
    id: category.name.toLowerCase().replace(/\s+/g, '-'),
    ...category
  });
  saveCategories();
  renderCategories();
  showToast('Category added successfully');
}

// Rendering Functions
function renderTasks() {
  const filteredTasks = filterTasks();
  const sortedTasks = sortTasks(filteredTasks);
  
  tasksList.innerHTML = sortedTasks.map(task => `
    <div class="task-item" data-id="${task.id}">
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
      <div class="task-content">
        <div class="task-title">${task.title}</div>
        <div class="task-meta">
          <span class="task-date">${formatDate(task.dueDate)}</span>
          <span class="task-category">${getCategoryName(task.category)}</span>
          <span class="task-priority ${task.priority}">${task.priority}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="task-action" title="Edit">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="task-action" title="Delete">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  updateTaskCounts();
}

function renderCategories() {
  categoryList.innerHTML = categories.map(category => `
    <li class="category-item ${category.id === currentCategory ? 'active' : ''}" data-id="${category.id}">
      <div class="category-icon" style="background-color: ${category.color}">${category.icon}</div>
      <span>${category.name}</span>
      <span class="category-count">${getTaskCount(category.id)}</span>
    </li>
  `).join('');
}

// Event Listeners
function setupEventListeners() {
  // Theme toggle
  themeSwitch.addEventListener('click', toggleTheme);
  darkModeToggle.addEventListener('change', toggleTheme);

  // Modal controls
  addTaskBtn.addEventListener('click', () => showModal(addTaskModal));
  addCategoryBtn.addEventListener('click', () => showModal(addCategoryModal));
  settingsBtn.addEventListener('click', () => showModal(settingsModal));

  // Close modals
  [closeTaskModal, closeCategoryModal, closeSettingsModal].forEach(btn => {
    btn.addEventListener('click', () => {
      addTaskModal.classList.remove('active');
      addCategoryModal.classList.remove('active');
      settingsModal.classList.remove('active');
    });
  });

  // Form submissions
  addTaskForm.addEventListener('submit', handleAddTask);
  addCategoryForm.addEventListener('submit', handleAddCategory);

  // Category selection
  categoryList.addEventListener('click', handleCategoryClick);

  // Task actions
  tasksList.addEventListener('click', handleTaskClick);

  // Filter and sort
  filterBtn.addEventListener('click', showFilterMenu);
  sortBtn.addEventListener('click', showSortMenu);

  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('active');
    }
  });
}

// Event Handlers
function handleAddTask(e) {
  e.preventDefault();
  const formData = new FormData(addTaskForm);
  const task = {
    title: formData.get('taskTitle'),
    category: formData.get('taskCategory'),
    priority: formData.get('taskPriority'),
    dueDate: formData.get('taskDate')
  };
  addTask(task);
  addTaskModal.classList.remove('active');
  addTaskForm.reset();
}

function handleAddCategory(e) {
  e.preventDefault();
  const formData = new FormData(addCategoryForm);
  const category = {
    name: formData.get('categoryName'),
    icon: formData.get('categoryName').charAt(0).toUpperCase(),
    color: formData.get('categoryColor')
  };
  addCategory(category);
  addCategoryModal.classList.remove('active');
  addCategoryForm.reset();
}

function handleCategoryClick(e) {
  const categoryItem = e.target.closest('.category-item');
  if (categoryItem) {
    currentCategory = categoryItem.dataset.id;
    renderCategories();
    renderTasks();
  }
}

function handleTaskClick(e) {
  const taskItem = e.target.closest('.task-item');
  if (!taskItem) return;

  const taskId = parseInt(taskItem.dataset.id);
  const checkbox = e.target.closest('.task-checkbox');
  const editBtn = e.target.closest('.task-action[title="Edit"]');
  const deleteBtn = e.target.closest('.task-action[title="Delete"]');

  if (checkbox) {
    toggleTaskComplete(taskId);
  } else if (editBtn) {
    editTask(taskId);
  } else if (deleteBtn) {
    deleteTask(taskId);
  }
}

// Utility Functions
function showModal(modal) {
  modal.classList.add('active');
}

function showToast(message, duration = 2000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, duration);
  }, 100);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getCategoryName(categoryId) {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : 'Unknown';
}

function getTaskCount(categoryId) {
  return tasks.filter(task => 
    categoryId === 'all' ? true : task.category === categoryId
  ).length;
}

function updateTaskCounts() {
  document.querySelectorAll('.category-count').forEach(count => {
    const categoryId = count.closest('.category-item').dataset.id;
    count.textContent = getTaskCount(categoryId);
  });
}

// Filter and Sort Functions
function filterTasks() {
  return tasks.filter(task => {
    if (currentCategory !== 'all' && task.category !== currentCategory) return false;
    if (currentFilter === 'completed') return task.completed;
    if (currentFilter === 'active') return !task.completed;
    return true;
  });
}

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    switch (currentSort) {
      case 'date':
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
}

// Storage Functions
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

// Drag and Drop
function setupSortable() {
  new Sortable(tasksList, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    onEnd: function(evt) {
      const taskIds = [...tasksList.children].map(item => parseInt(item.dataset.id));
      tasks = taskIds.map(id => tasks.find(task => task.id === id));
      saveTasks();
    }
  });
}

// Filter and Sort Menus (to be implemented)
function showFilterMenu() {
  // Implementation for filter menu
  showToast('Filter functionality coming soon');
}

function showSortMenu() {
  // Implementation for sort menu
  showToast('Sort functionality coming soon');
}

// Initialize the app
init();