<template>
  <div class="app-container">
    <!-- Left side: Build Your Own section -->
    <div class="left-side">
      <!-- Build Your Own section, only visible if no meal type is selected -->
      <div v-if="!selectedBuildItem">
        <h2>Build Your Own</h2>
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
        <h2>Select up to 2 Sides for {{ selectedBuildItem.name }}</h2>
        <div class="sides">
          <div
            v-for="side in sides"
            :key="side.id"
            class="side-item"
            @click="addSideToOrder(side)"
            :disabled="isSideSelectionComplete"
          >
            <h3>{{ side.name }} - ${{ side.price }}</h3>
          </div>
        </div>
        <button
          v-if="selectedBuildItem.sides.length > 0"
          @click="addToCart"
          class="add-to-cart"
        >
          Add to Cart
        </button>
      </div>

      <!-- Entree selection view with scrollable grid -->
      <div v-else-if="isSelectingEntrees" class="entree-selection">
        <button @click="goBack" class="back-button">⬅ Back</button>
        <h2>Select Entrees for {{ selectedBuildItem.name }}</h2>
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
      <div v-for="(order, index) in orders" :key="index" class="order-item">
        <h4>{{ order.name }}</h4>
        <p>{{ order.description }}</p>
        <span>{{ order.price }}</span>
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
      isSelectingSides: false,
      isSelectingEntrees: false,
      selectedBuildItem: null,
      orders: [],
      buildItems: [
        { name: "Bowl", price: "$8.99", type: 0 },
        { name: "Plate", price: "$10.99", type: 1 },
        { name: "Bigger Plate", price: "$11.99", type: 2 },
      ],
      entrees: [],
      sides: []
    };
  },
  created() {
    this.fetchEntrees();
    this.fetchSides();
  },
  methods: {
    async fetchEntrees() {
      const response = await axios.get('/api/customers/entrees');
      this.entrees = response.data;
    },
    async fetchSides() {
      const response = await axios.get('/api/customers/sides');
      this.sides = response.data;
    },
    selectBuildYourOwn(item) {
      this.isSelectingEntrees = true;
      this.selectedBuildItem = { ...item, description: "", entrees: [], sides: [] };
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

      if (!this.orders.includes(this.selectedBuildItem)) {
        this.orders.push(this.selectedBuildItem);
      }

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
        this.resetSelection(); // Go back to the beginning if max sides reached
      }
    },
    addToCart() {
      this.resetSelection();
    },
    removeOrder(index) {
      this.orders.splice(index, 1);
      this.resetSelection();
    },
    placeOrder() {
      this.orders.forEach(order => {
        axios.post('/api/customers/place-order', {
          order_type: order.type,
          entrees: order.entrees,
          sides: order.sides
        });
      });
      alert("Order Placed Successfully");
      this.resetOrder();
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
      this.isSelectingEntrees = true;
      this.isSelectingSides = false;
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
  min-width: 400px; /* Set minimum width */
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

/* Scrollable area for entree selection */
.entree-selection .entrees {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 items per row */
  gap: 20px;
  max-height: 70vh;
  overflow-y: auto;
  padding: 10px;
}

/* Scrollable area for sides selection */
.side-selection .sides {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 items per row */
  gap: 20px;
  max-height: 50vh; /* Adjust height as needed */
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

/* Larger Back and Add to Cart buttons */
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
</style>


