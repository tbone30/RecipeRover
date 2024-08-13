<template>
    <div class="recipe-rover d-flex flex-column flex-md-row">
      <!-- Sidebar -->
      <div class="sidebar bg-primary text-white">
        <h2 class="p-3">Menu</h2>
        <ul class="nav flex-column">
          <li class="nav-item"><a href="#home" class="nav-link text-white">Home</a></li>
          <li class="nav-item"><a href="#recipe-book" class="nav-link text-white">Personal Recipe Book</a></li>
          <li class="nav-item"><a href="#chatbot" class="nav-link text-white">Chatbot</a></li>
          <li class="nav-item"><a href="#about" class="nav-link text-white">About Us</a></li>
          <li class="nav-item"><a href="#contact" class="nav-link text-white">Contact</a></li>
        </ul>
      </div>
  
      <!-- Main content -->
      <div class="main-content flex-grow-1 d-flex flex-column">
        <!-- Header -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-success">
          <div class="container-fluid">
            <a class="navbar-brand fw-bold" href="#">RecipeRover</a>
            <button class="btn btn-light" @click="redirectToLogin">Login</button>
          </div>
        </nav>
  
        <!-- Recipe Generator -->
        <div class="flex-grow-1 bg-light d-flex align-items-center justify-content-center p-3">
          <div class="card text-center shadow">
            <div class="card-body">
              <h5 class="card-title">Recipe Generator</h5>
              <select v-model="difficulty" class="form-select mb-3">
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button class="btn btn-success" @click="generateRecipe">Generate Recipe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'RecipeRover',
    data() {
      return {
        difficulty: ''
      }
    },
    methods: {
      generateRecipe() {
        if (this.difficulty) {
          alert(`Generating a ${this.difficulty} recipe...`)
          // Here you would typically make an API call or perform some action to generate the recipe
        } else {
          alert('Please select a difficulty level')
        }
      },
      redirectToLogin() {
        alert('Redirecting to login page...')
        // Here you would typically redirect to the login page
        // this.$router.push('/login')
      }
    }
  }
  </script>
  
  <style scoped>
  .recipe-rover {
    font-family: Arial, sans-serif;
    min-height: 100vh;
    width: 100%;
  }
  
  .sidebar {
    width: 100%;
    max-width: 250px;
  }
  
  .main-content {
    min-height: 100vh;
  }
  
  .navbar-brand {
    font-size: 1.5rem;
  }
  
  .card {
    width: 100%;
    max-width: 300px;
  }
  
  @media (max-width: 768px) {
    .sidebar {
      max-width: 100%;
    }
  }
  
  /* Custom color scheme */
  :root {
    --bs-primary: #3498db;  /* Blue */
    --bs-success: #2ecc71;  /* Green */
    --bs-light: #ecf0f1;    /* Light Gray */
    --bs-white: #ffffff;    /* White */
  }
  </style>