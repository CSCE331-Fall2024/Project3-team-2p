<template>
  <div class="app-container">
    <div v-if="!isAddingItems" class="menu-section">
      <h2>Suggested Orders</h2>
      <div class="order-items">
      //populate with current dummy data for Suggested 
        <div class="order-item" v-for="(item, index) in suggestedItems" :key="item.name + index" @click="addSuggestedOrder(item)">
          <img :src="item.image" alt="food" />
          <p>{{item.name}} - {{item.price}}</p>
          <p>{{item.description}}</p>
        </div>
      </div>
      //populate with current dummy data for BYOB
      <h2>Build Your Own</h2>
      <div class="order-items">
        <div class="order-item" v-for="(item, index) in buildYourOwnItems" :key="item.name + index" @click="showMealOptions(item)">
          <img :src="item.image" alt="food" />
          <p>{{ item.name }} - {{ item.price }}</p>
        </div>
      </div>
    </div>
    //Show meal options, only if isAddingItems is true tho
    <div v-if="isAddingItems" class="meal-options-section">
      <button @click="goBack">Back</button>
      <h2>Customize Your {{ selectedItemType }}</h2>
      <div class="meal-options">
        <div class="meal-option" v-for="(option, index) in mealOptions" :key="index" @click="addItemToOrder(option)">
          <img :src="option.image" alt="meal option" />
          <p>{{ option.name }}</p>
        </div>
      </div>
    </div>

    <div class="order-summary">
      <h2>Order Summary</h2>
      <div class="order-item-summary" v-for="(item, index) in order" :key="item.name + index">
        <p>{{ item.name }}</p>
        <p>{{ item.description }}</p>
        <p>{{ item.price }}</p>
        <button class="remove-btn" @click="removeItem(index)">✖</button>
      </div>
      <button class="place-order">Place Order</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomerView",
  data() {
    return {
      //needed variables
      order: [],
      isAddingItems: false,
      selectedItemType: '',
      //Current dummy meal options
      mealOptions: [
        { name: 'Orange Chicken', image: require('../assets/image 8.png') },
        { name: 'Beef Broccoli', image: require('../assets/image 9.png') },
        { name: 'Chow Mein', image: require('../assets/image.png') },
      ],
      //Dummy data for suggested orders. I will replace this with the dynamic soon
      suggestedItems: [
        { name: 'Bigger Plate', price: '$14.99', description: 'Broccoli Beef, Orange Chicken, White Rice', image: require('../assets/image 8.png') },
        { name: 'Bigger Plate', price: '$14.99', description: 'Broccoli Beef, Orange Chicken, Chow Mein', image: require('../assets/image.png') },
        { name: 'Bowl', price: '$9.99', description: 'Orange Chicken, Rice', image: require('../assets/image 9.png') },
      ],
      //Build your own bowl options
      buildYourOwnItems: [
        { name: 'Bowl', price: '$8.99', image: require('../assets/image 9.png') },
        { name: 'Plate', price: '$10.99', image: require('../assets/image.png') },
        { name: 'Bigger Plate', price: '$11.99', image: require('../assets/image 8.png') },
      ]
    };
  },
  methods: {
    addSuggestedOrder(item) {
      this.order.push(item);
    },
    showMealOptions(item) {
      this.selectedItemType = item.name;
      this.isAddingItems = true;
    },
    addItemToOrder(option) {
      const customizedItem = { ...option, name: this.selectedItemType };
      this.order.push(customizedItem);
      this.isAddingItems = false;
    },
    goBack() {
      this.isAddingItems = false;
    },
    //this removes the order in progress
    removeItem(index) {
      this.order.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.menu-section, .meal-options-section {
  width: 70%;
}

.order-items, .meal-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.order-item, .order-item-summary, .meal-option {
  background-color: #444;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  width: 30%;
  text-align: center;
  position: relative;
}

.order-item img, .meal-option img {
  width: 100px;
  height: 80px;
}

.order-summary {
  width: 25%;
  background-color: #2d2d2d;
  padding: 10px;
  border-radius: 8px;
  color: #fff;
}

.place-order {
  background-color: #d32f2f;
  color: #fff;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  border: none;
  cursor: pointer;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>
