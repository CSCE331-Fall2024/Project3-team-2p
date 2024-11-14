import AnalyticsService from './analytics_db.js';

async function testGetIngredientInTimeframe() {
    const analyticsService = new AnalyticsService();

    try {
        const startDate = new Date('2024-7-10');
        const endDate = new Date('2024-11-10');
        const ingredientId = 9;

        const usageData = await analyticsService.getIngredientInTimeframe(startDate, endDate, ingredientId);

        console.log(`Usage Data for ${ingredientName} from ${startDate.toISOString()} to ${endDate.toISOString()}:`, usageData);
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await analyticsService.close();
    }
}

testGetIngredientInTimeframe();