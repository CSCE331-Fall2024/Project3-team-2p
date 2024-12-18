<template>
  <div class="app-container">
    <!-- Left side: Main view or Entree selection view -->
    <div class="left-side">
      <TranslateButton />
      <div class="login-buttons-contain">
        <button class="login-buttons" @click="loginAsManager">Login as Manager</button>
        <button class="login-buttons" @click="loginAsCashier">Login as Cashier</button>
      </div>
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
            <img
              v-if="order.entrees.length"
              :src="getImageUrl(order.entrees[0])"
              alt="Entree Image"
              class="order-image"
            />
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
            :class="{ disabled: isSideSelectionComplete && !selectedBuildItem.sides.includes(side.name) }"
          >
            <img
              :src="side.image"
              :alt="side.name + ' Image'"
              class="item-image"
            />
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
            :class="{ disabled: isEntreeSelectionComplete }"
          >
            <img
              :src="entree.image"
              :alt="entree.name + ' Image'"
              class="item-image"
            />
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

    <!-- Toggle Button for Mobile Order Summary -->
    <button class="order-summary-toggle" @click="toggleOrderSummary" v-if="isMobileView">
      🛒 {{ orders.length }} Item(s)
    </button>

    <!-- Modal for Order Summary on Mobile -->
    <div class="order-summary-modal" v-if="isOrderSummaryVisible">
      <div class="modal-content">
        <button class="close-modal" @click="toggleOrderSummary">✖</button>
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
  </div>
</template>

<script>
import axios from 'axios';
import TranslateButton from './TranslateButton.vue';
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

export default {
  components: {
    TranslateButton
  },
  data() {
    return {
      isSelectingSides: false,
      isSelectingEntrees: false,
      selectedBuildItem: null,
      maxSides: 2,
      orders: [],
      entreeList: [], 
      sideList: [],
      orderType: null,
      suggestedOrders: [],
      buildItems: [
        { name: "Bowl", price: "$8.99", type: 0 },
        { name: "Plate", price: "$9.99", type: 1 },
        { name: "Bigger Plate", price: "$11.99", type: 2 },
      ],
      entrees: [],
      sides: [],
      isOrderSummaryVisible: false,
      isMobileView: false
    };
  },
  created() {
    this.fetchEntrees();
    this.fetchSides();
    this.checkViewport();
    window.addEventListener('resize', this.checkViewport);
  },
  async mounted() {
    await this.fetchPopularSuggestions();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkViewport);
  },
  computed: {
    isSideSelectionComplete() {
      return this.selectedBuildItem.sides.length >= this.maxSides;
    },
    isEntreeSelectionComplete() {
      const entreeLimit = this.selectedBuildItem
        ? (this.selectedBuildItem.name === 'Bowl' ? 1 
          : this.selectedBuildItem.name === 'Plate' ? 2 
          : 3)
        : 0;
      return this.selectedBuildItem && this.selectedBuildItem.entrees.length >= entreeLimit;
    }
  },
  methods: {
    /**
     * Fetches entrees data from the API.
     *
     * @async
     * @returns {Promise<void>}
     */
    async fetchEntrees() {
      try {
        const response = await axios.get('/api/customers/entrees');
        this.entrees = response.data;
        console.log('Entrees fetched:', this.entrees);
      } catch (error) {
        console.error('Error fetching entrees:', error);
      }
    },
    /**
     * Fetches sides data from the API.
     *
     * @async
     * @returns {Promise<void>}
     */
    async fetchSides() {
      try {
        const response = await axios.get('/api/customers/sides');
        this.sides = response.data;
      } catch (error) {
        console.error('Error fetching sides:', error);
      }
    },
    /**
     * Fetches popular suggested orders from the API.
     *
     * @async
     * @returns {Promise<void>}
     */
    async fetchPopularSuggestions() {
      try {
        const response = await axios.get('/api/suggestions/popular');
        const { entrees, sides } = response.data;
        console.log('Fetched suggestions:', entrees, sides);

        if (!entrees || !entrees[0] || !sides || !sides[0]) {
          console.warn("Expected structure not found in suggestions response.");
          return;
        }

        this.suggestedOrders = [
          {
            name: "Bowl",
            price: "$8.99",
            description: `${entrees[0][0].name}, ${sides[0][0].name}`,
            entrees: [entrees[0][0].name],
            sides: [sides[0][0].name],
            type: 0
          },
          {
            name: "Plate",
            price: "$9.99",
            description: `${entrees[1][0].name}, ${entrees[1][1].name}, ${sides[1][0].name}`,
            entrees: [entrees[1][0].name, entrees[1][1].name],
            sides: [sides[1][0].name],
            type: 1
          },
          {
            name: "Bigger Plate",
            price: "$11.99",
            description: `${entrees[2][0].name}, ${entrees[2][1].name}, ${entrees[2][2].name}, ${sides[2][0].name}`,
            entrees: [entrees[2][0].name, entrees[2][1].name, entrees[2][2].name],
            sides: [sides[2][0].name],
            type: 2
          }
        ];

        console.log('Suggested orders set:', this.suggestedOrders);
      } catch (error) {
        console.error('Error fetching popular suggestions:', error);
      }
    },
    /**
     * Adds a suggested order to the order list.
     *
     * @param {Object} order - The suggested order object.
     * @returns {void}
     */
    addOrder(order) {
      this.orders.push(order);
    },
    /**
     * Removes an order from the order list.
     *
     * @param {number} index - The index of the order to remove.
     * @returns {void}
     */
    removeOrder(index) {
      this.orders.splice(index, 1);
      this.selectedBuildItem = null;
      this.isSelectingEntrees = false;
      this.isSelectingSides = false;
    },
    /**
     * Selects a build-your-own item and initializes the selection process.
     *
     * @param {Object} item - The selected build item.
     * @returns {void}
     */
    selectBuildYourOwn(item) {
      this.isSelectingEntrees = true;
      this.selectedBuildItem = { ...item, description: "", entrees: [], sides: [] };
      this.orderType = item.type;
    },
    /**
     * Adds an entree to the selected build item.
     *
     * @param {Object} entree - The selected entree.
     * @returns {void}
     */
    addEntreeToOrder(entree) {
      const entreeLimit = this.selectedBuildItem.name === 'Bowl' ? 1 
                        : this.selectedBuildItem.name === 'Plate' ? 2 
                        : 3;

      if (this.selectedBuildItem.entrees.length >= entreeLimit) {
        this.selectedBuildItem.entrees.shift(); 
      }

      this.selectedBuildItem.entrees.push(entree.name);
      this.entreeList.push(entree.name);
      this.selectedBuildItem.description = this.selectedBuildItem.entrees.join(", ");

      let tempPrice = this.selectedBuildItem.price.substring(1);
      tempPrice = (Number(tempPrice) + Number(entree.price)).toFixed(2);
      this.selectedBuildItem.price = `$${tempPrice}`;
      
      if (!this.orders.includes(this.selectedBuildItem)) {
        this.orders.push(this.selectedBuildItem);
      }

      if (this.selectedBuildItem.entrees.length >= entreeLimit) {
        this.goToSidesView();
      }
    },
    /**
     * Adds a side to the selected build item.
     *
     * @param {Object} side - The selected side.
     * @returns {void}
     */
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
        this.selectedBuildItem = null;
        this.isSelectingEntrees = false;
        this.isSelectingSides = false;
      }
    },
    /**
     * Adds the current build item to the order list and resets the selection.
     *
     * @returns {void}
     */
    addToCart() {
      this.resetSelection();
    },
    /**
     * Resets the selected build item and selection stage.
     *
     * @returns {void}
     */
    resetSelection() {
      this.selectedBuildItem = null;
      this.isSelectingEntrees = false;
      this.isSelectingSides = false;
    },
    /**
     * Goes back to the previous selection stage.
     *
     * @returns {void}
     */
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
     /**
     * Moves to the side selection stage.
     *
     * @returns {void}
     */
    goToSidesView() {
      this.isSelectingEntrees = false;
      this.isSelectingSides = true;
    },
    /**
     * Moves back to the entree selection stage.
     *
     * @returns {void}
     */
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
          await axios.post('/api/customers/place-order', {
            order_type: orderType,
            entrees: entrees,
            sides: sides
          });
        } catch (error) {
          console.error('Error placing order:', error); 
          alert('Failed to place order. Please try again.');
          return; 
        }
      }  
      alert("Order Placed Successfully");
      this.resetOrder();
    },
    async loginAsManager() {
      window.location.href = process.env.VUE_APP_BASE_URL + 'auth/google?role=manager';
    },
    async loginAsCashier() {
      window.location.href = process.env.VUE_APP_BASE_URL + 'auth/google?role=cashier';
    },
    resetOrder() {
      this.orders = [];
      this.entreeList = [];
      this.sideList = [];
      this.orderType = null;
      this.selectedBuildItem = null;
      this.isSelectingEntrees = false;
      this.isSelectingSides = false;
      this.isOrderSummaryVisible = false;
    },
    getImageUrl(entreeName) {
      const entree = this.entrees.find(e => e.name === entreeName);
      return entree ? entree.image : '';
    },
    getBuildImageUrl(buildItem) {
      const buildImages = {
        "Bowl": "path/to/bowl-image.jpg",
        "Plate": "path/to/plate-image.jpg",
        "Bigger Plate": "path/to/bigger-plate-image.jpg"
      };
      return buildImages[buildItem.name] || '';
    },
    toggleOrderSummary() {
      this.isOrderSummaryVisible = !this.isOrderSummaryVisible;
    },
    checkViewport() {
      this.isMobileView = window.innerWidth <= 768; 
      if (!this.isMobileView && this.isOrderSummaryVisible) {
        this.isOrderSummaryVisible = false;
      }
    }
  },
};
</script>


<style scoped>

.app-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
  padding: 20px;
  height: 100vh; /* Added to occupy full viewport height */
  box-sizing: border-box; /* Ensure padding is included in height */
}

/* Left side for main or entree selection views */
.left-side {
  flex: 1; /* Allows it to take available space */
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Enables scrolling */
}

/* Right side for order summary */
.order-summary {
  flex: 1;
  padding: 20px;
  background-color: #333;
  color: #fff;
  border-radius: 8px;
  position: sticky;
  top: 20px;
  height: fit-content;
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
  background-color: #444;
  color: #fff;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
}

.order-image,
.item-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
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
  background-color: #555;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}

.order-item h4 {
  margin: 0;
}

.order-item p {
  margin: 5px 0;
}

.order-item span {
  font-weight: bold;
}

.order-item button {
  background: none;
  border: none;
  color: #ff0000;
  cursor: pointer;
  font-size: 1.2rem;
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

.place-order:hover {
  background-color: #e60000;
}

.place-order:active {
  background-color: #cc0000;
}

/* Entree and Sides selection styling */
.entree-selection,
.side-selection {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  align-items: center;
  /* Removed height and overflow properties */
}

/* Suggested Orders, Build Your Own, Entrees, Sides grid layout */
.entrees,
.sides {
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

.back-button:hover {
  background-color: #555;
}

.side-item.disabled,
.entree-item.disabled {
  opacity: 0.5;
  pointer-events: none;
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
.login-buttons-contain{
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-buttons{
  align-self: flex-start;
  padding: 10px;
  font-size: 1rem;
  cursor: pointer;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
}

/* Toggle Button for Mobile Order Summary */
.order-summary-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ff0000;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 15px 20px;
  font-size: 1rem;
  cursor: pointer;
  z-index: 1000;
  display: none; /* Hidden by default */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.order-summary-toggle:hover {
  background-color: #e60000;
}
.order-summary-toggle:active {
  background-color: #cc0000;
}
.order-summary-toggle::after {
  content: '🛒';
  margin-right: 8px;
}

/* Modal Styling */
.order-summary-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal-content {
  background-color: #333;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
    padding: 10px;
    height: 100vh; /* Ensure full height */
  }

  .left-side {
    flex: 1;
    overflow-y: auto; /* Enable scrolling */
  }

  .suggested-orders,
  .build-your-own,
  .entrees,
  .sides {
    grid-template-columns: repeat(2, 1fr);
  }

  .order-summary {
    display: none; /* Hide the order summary on mobile */
  }

  .order-summary-toggle {
    display: block; /* Show toggle button on mobile */
  }

  .order-summary-modal .modal-content {
    width: 95%;
    max-width: 450px;
  }

  .order-summary-toggle {
    font-size: 1rem;
    padding: 12px 16px;
  }

  .order-summary-modal .close-modal {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .suggested-orders,
  .build-your-own,
  .entrees,
  .sides {
    grid-template-columns: 1fr;
  }

  .order-image,
  .item-image {
    height: 100px;
  }

  .modal-content {
    padding: 15px;
  }

  .place-order {
    font-size: 1rem;
    padding: 8px;
  }

  .order-summary-toggle {
    font-size: 0.9rem;
    padding: 10px 14px;
  }
}

/* Optional: Enhance Scrollbar Appearance */
.left-side {
  scrollbar-width: thin; /* For Firefox */
  -ms-overflow-style: none;  /* For Internet Explorer and Edge */
}

.left-side::-webkit-scrollbar {
  width: 6px;
}

.left-side::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

</style>
