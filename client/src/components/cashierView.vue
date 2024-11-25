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
            :class="{ disabled: isSideSelectionComplete }"
          >
            <!-- This is to fill out the sides as well as have the functionality to add side to order
                 The div itself acts as a button -->
            <h3>{{ side.name }} - ${{ side.price }}</h3>
          </div>
        </div>
        <button
          v-if="selectedBuildItem.sides.length > 0 && selectedBuildItem.sides.length < 2"
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
    <div :class="['order-summary', { 'mobile-visible': isOrderSummaryVisible }]" >
      <div class="order-summary-content">
        <h2>Order Summary</h2>

        <!-- Show in-progress order while building -->
        <div v-if="inProgressOrder" class="order-item in-progress">
          <h4>{{ inProgressOrder.name }} (In Progress)</h4>
          <p>{{ inProgressOrder.description }}</p>
          <span>Total: ${{ inProgressOrder.totalCost.toFixed(2) }}</span>
        </div>

        <!-- List of completed orders -->
        <div v-for="(order, index) in orders" :key="index" class="order-item">
          <h4>{{ order.name }}</h4>
          <p>{{ order.description }}</p>
          <span>Total: ${{ order.totalCost.toFixed(2) }}</span>
          <button @click="removeOrder(index)" class="remove-button">Remove</button>
        </div>
        <button class="place-order" @click="placeOrder">Place Order</button>
      </div>
      <!-- Close button for mobile view -->
      <button class="close-summary" @click="toggleOrderSummary">✕</button>
    </div>

    <!-- Toggle button for mobile view -->
    <button v-if="isMobile" class="toggle-summary" @click="toggleOrderSummary">
      {{ isOrderSummaryVisible ? 'Hide' : 'Show' }} Summary
    </button>
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
        { name: "Plate", price: "$9.99", type: 1 },
        { name: "Bigger Plate", price: "$11.99", type: 2 },
      ],
      entrees: [],
      sides: [],
      server: 2, // Feature to take in the server ID
      isOrderSummaryVisible: false, // For mobile toggle
      isMobile: false, // To detect mobile devices
    };
  },
  computed: {
    // Computed property to display the in-progress order
    inProgressOrder() {
      return this.selectedBuildItem
        ? { ...this.selectedBuildItem, description: this.selectedBuildItem.description || "" }
        : null;
    },
    // Computed property to determine if side selection is complete
    isSideSelectionComplete() {
      return this.selectedBuildItem && this.selectedBuildItem.sides.length >= 2;
    },
  },
  created() {
    this.fetchEntrees();
    this.fetchSides();
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  beforeUnmount() { // Use beforeUnmount if using Vue 3
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    // Fetch entrees from API
    async fetchEntrees() {
      try {
        const response = await axios.get('/api/cashier/entrees');
        this.entrees = response.data;
      } catch (error) {
        console.error('Error fetching entrees:', error);
      }
    },
    // Fetch sides from API
    async fetchSides() {
      try {
        const response = await axios.get('/api/cashier/sides');
        this.sides = response.data;
      } catch (error) {
        console.error('Error fetching sides:', error);
      }
    },
    // Handle Build Your Own selection
    selectBuildYourOwn(item) {
      this.isSelectingEntrees = true;
      const basePrice = Number(item.price.replace('$', ''));
      this.selectedBuildItem = { 
        ...item, 
        description: "", 
        entrees: [], 
        sides: [], 
        type: item.type, 
        server: this.server, 
        totalCost: basePrice 
      };
      this.selectedBuildItem.price = `$${this.selectedBuildItem.totalCost.toFixed(2)}`;
    },
    // Add entree to order
    addEntreeToOrder(entree) {
      const entreeLimit = this.selectedBuildItem.name === 'Bowl' ? 1 
                          : this.selectedBuildItem.name === 'Plate' ? 2 
                          : 3;

      if (this.selectedBuildItem.entrees.length >= entreeLimit) {
        this.selectedBuildItem.entrees.shift();
      }

      this.selectedBuildItem.entrees.push(entree.name);
      this.selectedBuildItem.description = this.selectedBuildItem.entrees.join(", ");

      this.selectedBuildItem.totalCost += parseFloat(entree.price.replace('$', ''));
      this.selectedBuildItem.price = `$${this.selectedBuildItem.totalCost.toFixed(2)}`;

      if (this.selectedBuildItem.entrees.length >= entreeLimit) {
        this.goToSidesView();
      }
    },
    // Add side to order
    addSideToOrder(side) {
      if (this.selectedBuildItem.sides.length < 2) {
        this.selectedBuildItem.sides.push(side.name);
        this.selectedBuildItem.description = [
          ...this.selectedBuildItem.entrees,
          ...this.selectedBuildItem.sides,
        ].join(", ");
        this.selectedBuildItem.totalCost += parseFloat(side.price.replace('$', ''));
        this.selectedBuildItem.price = `$${this.selectedBuildItem.totalCost.toFixed(2)}`;
      }
      if (this.selectedBuildItem.sides.length >= 2) {
        this.addToCart();
      }
    },
    // Add current selection to cart
    addToCart() {
      this.orders.push({ ...this.selectedBuildItem });
      console.log("Order added to cart:", this.selectedBuildItem);
      this.resetSelection();
    },
    // Remove order from cart
    removeOrder(index) {
      this.orders.splice(index, 1);
    },
    // Place orders to server
    async placeOrder() {
      for (const order of this.orders) {
        const orderType = order.type;
        const entrees = order.entrees;
        const sides = order.sides;
        const server = this.server;
        console.log(`Placing order with data:`, {
            order_type: order.type,
            entrees: order.entrees,
            sides: order.sides,
            server: this.server
        });

        if (![0, 1, 2].includes(orderType)) {
          alert('Invalid order type. Please select a valid type.');
          return;
        }
        if (entrees.length === 0) {
            alert('Please add at least one entree.');
            return;
        }
        if ((orderType === 0 && entrees.length !== 1) ||
            (orderType === 1 && entrees.length !== 2) ||
            (orderType === 2 && entrees.length !== 3)) {
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
          return; // Exit if any order fails
        }
      }  
      alert("Order Placed Successfully");
      this.resetOrder(); // Reset order summary if needed
    },
    // Reset all orders
    resetOrder() {
      this.orders = [];
      this.resetSelection();
    },
    // Reset current selection
    resetSelection() {
      this.selectedBuildItem = null;
      this.isSelectingEntrees = false;
      this.isSelectingSides = false;
    },
    // Navigate back in selection
    goBack() {
      this.isSelectingEntrees = false;
      this.selectedBuildItem = null;
    },
    // Navigate to sides selection
    goToSidesView() {
      this.isSelectingEntrees = false;
      this.isSelectingSides = true;
    },
    // Navigate back to entree selection from sides
    goBackToEntreeSelection() {
      if (this.selectedBuildItem) {
        // Optionally, subtract the cost of sides when going back
        // Currently, assuming sides have no separate cost adjustment
        this.selectedBuildItem.sides = [];
        this.isSelectingSides = false;
        this.isSelectingEntrees = true;
      }
    },
    // Check if device is mobile
    checkMobile() {
      this.isMobile = window.innerWidth <= 950;
      console.log(`Window width: ${window.innerWidth}, isMobile: ${this.isMobile}`);
      if (!this.isMobile) {
        this.isOrderSummaryVisible = true; // Always show on larger screens
      } else {
        this.isOrderSummaryVisible = false; // Hide by default on mobile
      }
    },
    // Toggle order summary visibility on mobile
    toggleOrderSummary() {
      if (this.isMobile) {
        this.isOrderSummaryVisible = !this.isOrderSummaryVisible;
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
  position: relative;
}

.left-side, .order-summary {
  padding: 10px;
}

/* Order Summary styling */
.order-summary {
  background-color: #333;
  color: #fff;
  min-width: 400px;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  transition: transform 0.3s ease-in-out;
}

/* Initially visible on desktop, hidden on mobile */
.order-summary {
  flex: 1;
}

.order-summary-content {
  overflow-y: auto;
  max-height: 80vh;
}

/* Mobile-specific styles */
@media (max-width: 950px) {
  .app-container {
    flex-direction: column;
  }

  .order-summary {
    position: fixed;
    top: 0;
    right: 0;
    width: 80%;
    height: 100%;
    z-index: 1000;
    transform: translateX(100%);
    box-shadow: -2px 0 5px rgba(0,0,0,0.5);
  }

  .order-summary.mobile-visible {
    transform: translateX(0);
  }

  .toggle-summary {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #333;
    color: white;
    border: none;
    padding: 15px 20px;
    border-radius: 50px;
    font-size: 1rem;
    cursor: pointer;
    z-index: 1100;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  }

  .close-summary {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .order-summary-content {
    padding-top: 40px; /* Space for close button */
  }
}

/* Build Your Own, Entrees, and Sides sections */
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
  transition: background-color 0.2s ease-in-out;
}

.build-item:hover, .entree-item:hover, .side-item:hover {
  background-color: #555;
}

/* Disable side items when selection is complete */
.side-item.disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* Entree selection with grid layout */
.entree-selection .entrees {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
  max-height: 70vh;
  overflow-y: auto;
  padding: 10px;
}

/* Side selection with grid layout */
.side-selection .sides {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
  max-height: 50vh;
  overflow-y: auto;
  padding: 10px;
}

/* Place Order button */
.place-order {
  width: 100%;
  padding: 20px;
  background-color: #ff0000;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  margin-top: 20px;
  border-radius: 8px;
  transition: background-color 0.2s ease-in-out;
}

.place-order:hover {
  background-color: #ff3333;
}

/* Remove button */
.remove-button {
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 5px;
  transition: background-color 0.2s ease-in-out;
}

.remove-button:hover {
  background-color: #ff5555;
}

/* Back and Add to Cart buttons */
.back-button, .add-to-cart {
  width: 100%;
  padding: 15px;
  font-size: 1.2rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.back-button:hover, .add-to-cart:hover {
  background-color: #555;
}
</style>
