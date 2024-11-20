<template>
  <div class="app-container">
    <!-- Left side: Main view or Entree selection view -->
    <div class="left-side">
      <div v-if="!isSelectingEntrees && !isSelectingSides">
        <!-- Suggested Orders section -->
        <h2 class="labels">Suggested Orders</h2>
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
      <div v-else-if="isSelectingSides" class="side-selection">
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
            <div class="details">
              <h3>{{ side.name }}</h3>
              <p>Price: ${{ side.price }}</p>
            </div>
          </div>
        </div>
        <button v-if="selectedBuildItem.sides.length > 0" @click="addToCart" class="add-to-cart">
          Add to Cart
        </button>
      </div>
      <!-- Entree selection view -->
      <div v-else class="entree-selection">
        <button @click="goBack" class="back-button">⬅ Back</button>
        <h2 class="labels">Select Entrees for {{ selectedBuildItem.name }}</h2>
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
      maxSides: 2,
      orders: [],
      entreeList: [], //List of entrees for API call
      sideList: [], //list of sides for API call
      orderType: null, //order type for API call
      suggestedOrders: [
        {name: "Plate",
          price: "$10.99",
          description: "Broccoli Beef, Orange Chicken, White Rice",
          entrees: ["Broccoli Beef", "Orange Chicken"],
          sides: ["White Rice"],
          type: 1
        },
        {name: "Plate",
          price: "$10.99",
          description: "Broccoli Beef, Teriyaki Chicken, Chow Mein",
          entrees: ["Broccoli Beef", "Orange Chicken"],
          sides: ["Chow Mein"],
          type: 1
        },
        {name: "Bowl",
          price: "$9.99",
          description: "Orange Chicken, White Rice",
          entrees: ["Orange Chicken"],
          sides: ["White Rice"],
          type: 0
        }
      ],
      buildItems: [
        { name: "Bowl", price: "$8.99", type: 0 },
        { name: "Plate", price: "$9.99", type: 1 },
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
  computed: {
    isSideSelectionComplete() {
      return this.selectedBuildItem.sides.length >= this.maxSides;
    },
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
      const entreeLimit = this.selectedBuildItem.name === 'Bowl' ? 1 
                        : this.selectedBuildItem.name === 'Plate' ? 2 
                        : 3;

      // Check if entrees exceed the allowed number for this order type
      if (this.selectedBuildItem.entrees.length >= entreeLimit) {
        this.selectedBuildItem.entrees.shift(); // Remove the first entree (FIFO)
      }

      this.selectedBuildItem.entrees.push(entree.name);
      this.entreeList.push(entree.name);
      this.selectedBuildItem.description = this.selectedBuildItem.entrees.join(", ");
      
      // Update price based on added entree
      let tempPrice = this.selectedBuildItem.price.substring(1);
      tempPrice = (Number(tempPrice) + Number(entree.price)).toFixed(2);
      this.selectedBuildItem.price = `$${tempPrice}`;
      
      // Check if this build item is already in orders
      if (!this.orders.includes(this.selectedBuildItem)) {
        this.orders.push(this.selectedBuildItem);
      }

      // Move to sides selection if entree count meets the limit for the build item type
      if (this.selectedBuildItem.entrees.length >= entreeLimit) {
        this.goToSidesView();
      }
    },
    addSideToOrder(side) {
      if(this.selectedBuildItem.sides.length < this.maxSides){
        this.selectedBuildItem.sides.push(side.name);
        this.sideList.push(side.name);
        this.selectedBuildItem.description = [
          ...this.selectedBuildItem.entrees,
          ...this.selectedBuildItem.sides,
        ].join(", ");
      }
      if (this.selectedBuildItem.sides.length === this.maxSides){
        //this.orders.push({ ...this.selectedBuildItem });
        this.selectedBuildItem = null;
        this.isSelectingEntrees = false;
        this.isSelectingSides = false;
      }
    },
    addToCart() {
      this.resetSelection();
    },
    resetSelection() {
      this.selectedBuildItem = null;
      this.isSelectingEntrees = false;
      this.isSelectingSides = false;
    },
    goBack() {
      if (this.selectedBuildItem) {
        this.selectedBuildItem.entrees = [];
        this.entreeList = [];
        this.selectedBuildItem.description = '';
        this.selectedBuildItem.price = this.buildItems.find(
          (item) => item.name === this.selectedBuildItem.name
        ).price;
      }
      this.isSelectingEntrees = false;
      this.isSelectingSides = false;
      this.selectedBuildItem = null;
    },
    goToSidesView() {
      this.isSelectingEntrees = false;
      this.isSelectingSides = true;
    },
    goBackToEntreeSelection() {
      if (this.selectedBuildItem) {
        this.selectedBuildItem.sides = [];
        this.sideList = [];
        this.selectedBuildItem.description = this.selectedBuildItem.entrees.join(', ');
      }
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
        if (sides.length > 2) {
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

.labels {
  color: black;
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
.side-selection {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  align-items: center;
  height: 100%; /* Ensures the section takes full height */
  overflow-y: auto; /* Enables scrolling */
  max-height: 90vh; /* Optional: limit the height to a portion of the viewport */
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

.add-to-cart {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #ff0000;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.add-to-cart:hover {
  background-color: #fe0000;
  transform: scale(1.05);
}
.add-to-cart {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.add-to-cart:active{
  background-color: #e63900;
  transform: scale(1);
}

</style>

