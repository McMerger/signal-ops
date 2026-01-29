import { apiCall } from '../api-client';

export interface OrderResponse {
    order_id: string;
    strategy_name: string;
    symbol: string;
    side: string;
    quantity: number;
    price: number;
    executed_price?: number;
    status: string;
    exchange: string;
    timestamp: string;
}

export interface OrderListResponse {
    orders: OrderResponse[];
    count: number;
}

export interface SubmitOrderRequest {
    order_id?: string;
    strategy_name: string;
    symbol: string;
    side: string;
    quantity: number;
    price?: number;
    order_type?: string;
    exchange?: string;
}

export interface SubmitOrderResponse {
    success: boolean;
    order_id: string;
    exchange_order_id: string;
    status: string;
    executed_price: number;
    executed_quantity: number;
    fees: number;
    error?: string;
}

export interface CancelOrderRequest {
    symbol: string;
    exchange?: string;
}

export interface ModifyOrderRequest {
    symbol: string;
    new_quantity?: number;
    new_price?: number;
    exchange?: string;
}

export const ordersApi = {
    // List orders
    list: async (limit?: number): Promise<OrderListResponse> => {
        const params = limit ? { limit: limit.toString() } : {};
        return apiCall<OrderListResponse>({
            method: 'GET',
            url: '/api/v1/orders',
            params,
        });
    },

    // Submit order
    submit: async (order: SubmitOrderRequest): Promise<SubmitOrderResponse> => {
        return apiCall<SubmitOrderResponse>({
            method: 'POST',
            url: '/api/v1/orders',
            data: order,
        });
    },

    // Cancel order
    cancel: async (orderId: string, request: CancelOrderRequest): Promise<{ success: boolean; message: string }> => {
        return apiCall({
            method: 'DELETE',
            url: `/api/v1/orders/${orderId}`,
            data: request,
        });
    },

    // Modify order
    modify: async (orderId: string, request: ModifyOrderRequest): Promise<SubmitOrderResponse> => {
        return apiCall<SubmitOrderResponse>({
            method: 'PUT',
            url: `/api/v1/orders/${orderId}`,
            data: request,
        });
    },

    // Batch submit orders
    batchSubmit: async (orders: SubmitOrderRequest[], exchange?: string): Promise<{
        total: number;
        success: number;
        failed: number;
        results: Array<{ order_id: string; success: boolean; error?: string }>;
    }> => {
        return apiCall({
            method: 'POST',
            url: '/api/v1/orders/batch',
            data: { orders, exchange },
        });
    },

    // Get order status
    getStatus: async (orderId: string): Promise<{ order_id: string; status: string; message: string }> => {
        return apiCall({
            method: 'GET',
            url: '/api/v1/order_status',
            params: { order_id: orderId },
        });
    },

    // Stop Loss Order
    stopLoss: async (request: {
        symbol: string;
        side: string;
        quantity: number;
        stop_price: number;
        strategy_name?: string;
        exchange?: string;
    }): Promise<{ success: boolean; message: string; symbol: string; stop_price: number; note: string }> => {
        return apiCall({
            method: 'POST',
            url: '/api/v1/orders/stop_loss',
            data: request,
        });
    },

    // Take Profit Order
    takeProfit: async (request: {
        symbol: string;
        side: string;
        quantity: number;
        target_price: number;
        strategy_name?: string;
        exchange?: string;
    }): Promise<{ success: boolean; message: string; symbol: string; target_price: number; note: string }> => {
        return apiCall({
            method: 'POST',
            url: '/api/v1/orders/take_profit',
            data: request,
        });
    },
};
