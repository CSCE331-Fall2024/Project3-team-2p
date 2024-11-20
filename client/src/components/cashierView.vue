<template>
  <div class="app-container">
    <!-- Left side: Build Your Own section -->
    <div class="left-side">
      <!-- Build Your Own section, only visible if no meal type is selected -->
      <!-- Important: This is also visible if you have added one order, but also want to continue -->
      <div v-if="!selectedBuildItem">
        <h2 class="labels">Build Your Own</h2>
        <div class="build-your-own">
          <div
            v-for="item in buildItems"
            :key="item.name"
            class="build-item"
            @click="selectBuildYourOwn(item)"
          >
            <div class="details">
              <h3>{{ item.name }} - {{ item.price }}</h3>
            </div>
          </div>
        </div>
      </div>
      <!-- Side Selection View -->
      <div v-if="isSelectingSides" class="side-selection">
        <button @click="goBackToEntreeSelection" class="back-button">⬅ Back</button>
        <h2 class="labels">Select up to 2 Sides for {{ selectedBuildItem.name }}</h2>
        <div class="sides">
          <div
            v-for="side in sides"
            :key="side.id"
            class="side-item"
            @click="addSideToOrder(side)"
            :disabled="isSideSelectionComplete"
          >
          <!--This is to fill out the sides as well as have the functionality to add side to order
          I have made it so that the div itself is a button-->
            <h3>{{ side.name }} - ${{ side.price }}</h3>
          </div>
        </div>
        <button
          v-if="selectedBuildItem.sides.length > 0 && selectedBuildItem.sides.length < 2"
          @click="addToCart"
          class="add-to-cart"
        >
        <!--Add to cart if user only wants one side, otherwise, if 2 are filled out, it will automatically
        go to the creation of the next order -->
          Add to Cart
        </button>
      </div>

      <!-- Entree selection view with scrollable grid -->
      <div v-else-if="isSelectingEntrees" class="entree-selection">
        <button @click="goBack" class="back-button">⬅ Back</button>
        <h2 class="labels">Select Entrees for {{ selectedBuildItem.name }}</h2>
        <div class="entrees">
          <div
            v-for="entree in entrees"
            :key="entree.id"
            class="entree-item"
            @click="addEntreeToOrder(entree)"
          >
            <h3>{{ entree.name }} - ${{ entree.price }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side: Order Summary section -->
    <div class="order-summary">
    <h2>Order Summary</h2>

    <!-- Show in-progress order while building -->
    <div v-if="inProgressOrder" class="order-item in-progress">
        <h4>{{ inProgressOrder.name }} (In Progress)</h4>
        <p>{{ inProgressOrder.description }}</p>
        <span>Total: ${{ inProgressOrder.totalCost }}</span>
    </div>

    <!-- List of completed orders -->
    <div v-for="(order, index) in orders" :key="index" class="order-item">
        <h4>{{ order.name }}</h4>
        <p>{{ order.description }}</p>
        <span>Total: ${{ order.totalCost }}</span>
        <button @click="removeOrder(index)" class="remove-button">Remove</button>
    </div>
    <button class="place-order" @click="placeOrder">Place Order</button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
export default {
  data() {
    return {
    //We initialize a lot of the globals here for the time being
      isSelectingSides: false,
      isSelectingEntrees: false,
      selectedBuildItem: null,
      orders: [],
      buildItems: [
        { name: "Bowl", price: "$8.99", type: 0 },
        { name: "Plate", price: "$9.99", type: 1 },
        { name: "Bigger Plate", price: "$11.99", type: 2 },
      ],
      entrees: [],
      sides: [],
      server: 2 // Soon, will have a feature to take in the server ID
    };
  },
  computed: {
    // Computed property to display the in-progress order
    inProgressOrder() {
      return this.selectedBuildItem
        ? { ...this.selectedBuildItem, description: this.selectedBuildItem.description || "" }
        : null;
    },
  },
  created() {
    this.fetchEntrees();
    this.fetchSides();
  },
  methods: {
    //Very similar to customerView
    async fetchEntrees() {
      const response = await axios.get('/api/cashier/entrees');
      this.entrees = response.data;
    },
    async fetchSides() {
      const response = await axios.get('/api/cashier/sides');
      this.sides = response.data;
    },
    selectBuildYourOwn(item) {
      this.isSelectingEntrees = true;
      const basePrice = Number(item.price.replace('$', ''));
      this.selectedBuildItem = { ...item, description: "", entrees: [], sides: [], type: item.type, server: this.server, totalCost: basePrice};
      this.selectedBuildItem.price = `$${this.selectedBuildItem.totalCost.toFixed(2)}`;
    },
    addEntreeToOrder(entree) {
      const entreeLimit = this.selectedBuildItem.name === 'Bowl' ? 1 
                          : this.selectedBuildItem.name === 'Plate' ? 2 
                          : 3;

      if (this.selectedBuildItem.entrees.length >= entreeLimit) {
        this.selectedBuildItem.entrees.shift();
      }

      this.selectedBuildItem.entrees.push(entree.name);
      this.selectedBuildItem.description = this.selectedBuildItem.entrees.join(", ");

      this.selectedBuildItem.totalCost += entree.price;
      this.selectedBuildItem.price = `$${this.selectedBuildItem.totalCost.toFixed(2)}`;


      if (this.selectedBuildItem.entrees.length >= entreeLimit) {
        this.goToSidesView();
      }
    },
    addSideToOrder(side) {
      if (this.selectedBuildItem.sides.length < 2) {
        this.selectedBuildItem.sides.push(side.name);
        this.selectedBuildItem.description = [
          ...this.selectedBuildItem.entrees,
          ...this.selectedBuildItem.sides,
        ].join(", ");
      }
      if (this.selectedBuildItem.sides.length >= 2) {
        this.addToCart();
      }
    },
    addToCart() {
      this.orders.push({ ...this.selectedBuildItem });
      console.log("Order added to cart:", this.selectedBuildItem);
      this.resetSelection();
    },
    removeOrder(index) {
      this.orders.splice(index, 1);
      this.resetSelection();
    },
    async placeOrder() {

      for (const order of this.orders) {
        const orderType = order.type;
        const entrees = order.entrees;
        const sides = order.sides;
        const server = 2;
        console.log(`Placing order with data:`, {
            order_type: order.type,
            entrees: order.entrees,
            sides: order.sides,
            server: 2
        })

        if (![0, 1, 2].includes(orderType)) {
          alert('Invalid order type. Please select a valid type.');
          return;
        }
        if (entrees.length === 0) {
            alert('Please add at least one entree.');
            return;
        }
        if ((orderType === 0 && entrees.length != 1) ||
            (orderType === 1 && entrees.length != 2) ||
            (orderType === 2 && entrees.length != 3)) {
            alert("Invalid number of entrees.");
            return;
        }
        if (sides.length === 0) {
            alert('Please add at least one side.');
            return;
        }
        if (sides.length > 2) {
            alert("Too many sides.");
            return;
        }

        try {
          await axios.post('/api/cashier/place-order', {
            order_type: orderType,
            entrees: entrees,
            sides: sides,
            server: server

          });
          } catch (error) {
            console.error('Error placing order:', error); 
            alert('Failed to place order. Please try again.');
          }
      }  
      alert("Order Placed Successfully")
      this.resetOrder(); // Reset order summary if needed
  },

    resetOrder() {
      this.orders = [];
      this.resetSelection();
    },
    resetSelection() {
      this.selectedBuildItem = null;
      this.isSelectingEntrees = false;
      this.isSelectingSides = false;
    },
    goBack() {
      this.isSelectingEntrees = false;
      this.selectedBuildItem = null;
    },
    goToSidesView() {
      this.isSelectingEntrees = false;
      this.isSelectingSides = true;
    },
    goBackToEntreeSelection() {
      if (this.selectedBuildItem) {
        this.selectedBuildItem.sides = [];
        this.isSelectingSides = false;
        this.isSelectingEntrees = true;
      }
    }
  }
};
</script>

<style scoped>
/* Layout optimization for faster interactions */
.app-container {
  display: flex;
  gap: 20px;
  padding: 10px;
}

.left-side, .order-summary {
  padding: 10px;
}

.order-summary {
  background-color: #333;
  color: #fff;
  min-width: 400px;
  padding: 20px;
  border-radius: 8px;
}

.build-your-own, .entrees, .sides {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.build-item, .entree-item, .side-item {
  padding: 25px;
  flex: 1 1 45%;
  background-color: #444;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  font-size: 1.2rem;
  min-width: 150px;
}

.build-item:hover, .entree-item:hover, .side-item:hover {
  background-color: #555;
}

.entree-selection .entrees {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-height: 70vh;
  overflow-y: auto;
  padding: 10px;
}

.side-selection .sides {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-height: 50vh;
  overflow-y: auto;
  padding: 10px;
}

.place-order {
  width: 100%;
  padding: 20px;
  background-color: #ff0000;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  margin-top: 20px;
  border-radius: 8px;
}

.remove-button {
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 5px;
}
.remove-button:hover {
  background-color: #ff5555;
}

.back-button, .add-to-cart {
  width: 100%;
  padding: 20px;
  font-size: 1.5rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
}
.back-button:hover, .add-to-cart:hover {
  background-color: #555;
}
.labels {
  color: black;
}
</style>
