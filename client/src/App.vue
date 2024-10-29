<template>
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/customerView.vue' // If y'all need to test a view, replace this path with your path

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style> /*  This styling will be consistent throughout, probably won't change unless we want to change the font/etc which I am open to  */
html, body, #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
