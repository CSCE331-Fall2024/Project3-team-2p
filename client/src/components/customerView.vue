<template>
  <div class="app-container">
    <!-- Left side: Main view or Entree selection view -->
    <div class="left-side">
      <div v-if="!isSelectingEntrees && !isSelectingSides">
        <!-- Suggested Orders section -->
        <h2>Suggested Orders</h2>
        <div class="suggested-orders">
          <div
            v-for="order in suggestedOrders" 
            :key="order.name"
            class="suggested-order"
            @click="addOrder(order)"
          >
            <div class="details">
              <h3>{{ order.name }} - {{ order.price }}</h3>
              <p>{{ order.description }}</p>
            </div>
          </div>
        </div>

        <!-- Build Your Own section -->
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
      <div v-else-if="isSelectingSides" class="side-selection">
        <button @click="goBackToEntreeSelection" class="back-button">⬅ Back</button>
        <h2>Select Sides for {{ selectedBuildItem.name }}</h2>
        <div class="sides">
          <div
            v-for="side in sides" 
            :key="side.id"
            class="side-item"
            @click="addSideToOrder(side)"
          >
            <div class="details">
              <h3>{{ side.name }}</h3>
              <p>Price: ${{ side.price }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Entree selection view -->
      <div v-else class="entree-selection">
        <button @click="goBack" class="back-button">⬅ Back</button>
        <h2>Select Entrees for {{ selectedBuildItem.name }}</h2>
        <div class="entrees">
          <div
            v-for="entree in entrees" 
            :key="entree.id"
            class="entree-item"
            @click="addEntreeToOrder(entree)"
          >
            <div class="details">
              <h3>{{ entree.name }}</h3>
              <p>Price: ${{ entree.price }}</p>
            </div>
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
        <button @click="removeOrder(index)">✖</button>
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
      entreeList: [], //List of entrees for API call
      sideList: [], //list of sides for API call
      orderType: null, //order type for API call
      suggestedOrders: [
        { name: "Bigger Plate", price: "$14.99", description: "Broccoli Beef, Orange Chicken, White Rice" },
        { name: "Bigger Plate", price: "$14.99", description: "Broccoli Beef, Orange Chicken, Chow Mein" },
        { name: "Bowl", price: "$9.99", description: "Orange Chicken, Rice" },
      ],
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
    try {
      const response = await axios.get('/api/customers/entrees');
      this.entrees = response.data;
      console.log('Entrees fetched:', this.entrees);
    } catch (error) {
      console.error('Error fetching entrees:', error);
    }
  },
    async fetchSides() {
      try {
        const response = await axios.get('/api/customers/sides');
        this.sides = response.data;
      } catch (error) {
        console.error('Error fetching sides:', error);
      }
    },
    addOrder(order) {
      this.orders.push(order);
    },
    removeOrder(index) {
      this.orders.splice(index, 1);
      this.selectedBuildItem = null;
      this.isSelectingEntrees = false;
      this.isSelectingSides = false;
    },
    selectBuildYourOwn(item) {
      this.isSelectingEntrees = true;
      this.selectedBuildItem = { ...item, description: "", entrees: [], sides: [] };
      this.orderType = item.type

    },
    addEntreeToOrder(entree) {
      this.entreeList.push(entree.name);
      this.selectedBuildItem.entrees.push(entree.name)
      this.selectedBuildItem.description = this.selectedBuildItem.entrees.join(", ");
      if (!this.orders.includes(this.selectedBuildItem)) {
        this.orders.push(this.selectedBuildItem);
      }
      // Move to sides view based on the build item type
      const entreeCount = this.selectedBuildItem.name === 'Bowl' ? 1 : this.selectedBuildItem.name === 'Plate' ? 2 : 3;
      if (this.selectedBuildItem.entrees.length >= entreeCount) {
        this.goToSidesView();
      }
    },
    addSideToOrder(side) {
      this.selectedBuildItem.sides.push(side.name)
      this.sideList.push(side.name);
      this.selectedBuildItem.description = [...this.selectedBuildItem.entrees, ...this.selectedBuildItem.sides].join(", ");
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
    },
    async placeOrder() {

      for (const order of this.orders) {
        const orderType = order.type;
        const entrees = order.entrees;
        const sides = order.sides;

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
        if (sides.length != 1) {
            alert("Too many sides.");
            return;
        }

        try {
        // Send order data to the server
          await axios.post('/api/customers/place-order', {
            order_type: orderType,
            entrees: entrees,
            sides: sides
          });
          } catch (error) {
            console.error('Error placing order:', error); 
            alert('Failed to place order. Please try again.');
          }
      }  
      alert("Order Placed Successfully")
      this.resetOrder(); // Reset order summary if needed
  },
  
  // Reset order after placing (optional)
  resetOrder() {
    this.orders = [];
    this.entreeList = [];
    this.sideList = [];
    this.orderType = null;
    this.selectedBuildItem = null;
    this.isSelectingEntrees = false;
    this.isSelectingSides = false;
  }

  },
};
</script>

<style scoped>
/* Main container layout */
.app-container {
  display: flex;
  gap: 20px;
  padding: 20px;
}

/* Left side for main or entree selection views */
.left-side {
  flex: 2;
}

/* Right side for order summary */
.order-summary {
  flex: 1;
  padding: 20px;
  background-color: #333;
  color: #fff;
  border-radius: 8px;
}

/* Suggested Orders and Build Your Own sections */
.suggested-orders,
.build-your-own {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.suggested-order,
.build-item,
.entree-item,
.side-item { /* Combined styles for both entree and side items */
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #333;
  color: #fff;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.suggested-order:hover,
.build-item:hover,
.entree-item:hover,
.side-item:hover { /* Hover effect for both entree and side items */
  transform: scale(1.05);
}

.details {
  text-align: center;
}

.order-summary h2 {
  margin-top: 0;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #444;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}

.place-order {
  width: 100%;
  padding: 10px;
  background-color: #ff0000;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 10px;
}

/* Entree and Sides selection styling */
.entree-selection,
.side-selection { /* Matching styles for entree and side selection */
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  align-items: center;
}

.entrees,
.sides { /* Matching grid layout for entree and side items */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.back-button {
  align-self: flex-start;
  padding: 10px;
  font-size: 1rem;
  cursor: pointer;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
}
</style>

