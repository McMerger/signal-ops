import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order, CreateOrderDto } from "@/types/order";
import { ordersApi, OrderResponse } from "@/lib/api/orders-api";

// Helper function to map backend response to frontend Order type
function mapOrderResponse(response: OrderResponse): Order {
    return {
        id: response.order_id,
        symbol: response.symbol,
        side: response.side as "BUY" | "SELL",
        type: "MARKET", // Default, can be enhanced based on backend data
        price: response.price,
        quantity: response.quantity,
        status: response.status as "OPEN" | "FILLED" | "CANCELLED" | "REJECTED",
        timestamp: response.timestamp,
    };
}

export function useOrders(limit?: number) {
    return useQuery({
        queryKey: ["orders", limit],
        queryFn: async () => {
            const response = await ordersApi.list(limit);
            return response.orders.map(mapOrderResponse);
        },
    });
}

export function useCreateOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (order: CreateOrderDto & { strategyName?: string; exchange?: string }) => {
            return ordersApi.submit({
                strategy_name: order.strategyName || "manual",
                symbol: order.symbol,
                side: order.side,
                quantity: order.quantity,
                price: order.price,
                order_type: order.type,
                exchange: order.exchange || "binance",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
}

export function useCancelOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ orderId, symbol, exchange }: { orderId: string; symbol: string; exchange?: string }) => {
            return ordersApi.cancel(orderId, { symbol, exchange });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
}

export function useModifyOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ orderId, symbol, newQuantity, newPrice, exchange }: {
            orderId: string;
            symbol: string;
            newQuantity?: number;
            newPrice?: number;
            exchange?: string;
        }) => {
            return ordersApi.modify(orderId, { symbol, new_quantity: newQuantity, new_price: newPrice, exchange });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
}

