<template>
  <div id="app">
    <RecipeRover />
  </div>
</template>

<script>
import RecipeRover from './components/RecipeRover.vue'

export default {
  name: 'App',
  components: {
    RecipeRover
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Ensure proper rendering on mobile devices */
@viewport {
  width: device-width;
  zoom: 1.0;
}

@-ms-viewport {
  width: device-width;
}
</style>