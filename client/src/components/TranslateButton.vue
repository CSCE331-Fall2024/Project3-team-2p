<template>
  <div class="translate-container">
    <button class="translate-button" @click="translatePage">Translate</button>
  </div>
</template>

<script>
import { translatePage } from '../translation/translation';

export default {
  methods: {
    async translatePage() {
      try {
        await translatePage();
        console.log('Translation completed successfully!');
      } catch (error) {
        console.error('An error occurred during translation:', error);
      }
    }
  }
};
</script>

<style scoped>
.translate-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}

.translate-button {
  background-color: #007bff; /* Bootstrap-like blue color */
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.translate-button:hover {
  background-color: #0056b3; /* Darker blue for hover */
}

.translate-button:active {
  background-color: #003f7f; /* Even darker blue for click */
}
</style>
