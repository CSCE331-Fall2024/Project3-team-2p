import CustomerService from "../customer_service/customer_db.js";

class CashierService extends CustomerService {
    constructor() {
        super();
    }

    async placeOrder(order_type, entrees, sides, server) {
        await super.placeOrder(order_type, entrees, sides, server);
    }
}

export default CashierService;