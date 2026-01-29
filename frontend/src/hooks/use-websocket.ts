import { useEffect, useRef, useState } from 'react';

interface WebSocketOptions {
    url: string;
    onMessage?: (data: any) => void;
    onError?: (error: Error) => void;
    reconnectInterval?: number;
}

export function useWebSocket({ url, onMessage, onError, reconnectInterval = 5000 }: WebSocketOptions) {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<any>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

    const connect = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('[WebSocket] Connected to', url);
            setIsConnected(true);
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setLastMessage(data);
                onMessage?.(data);
            } catch (error) {
                console.error('[WebSocket] Failed to parse message:', error);
            }
        };

        ws.onerror = (event) => {
            console.error('[WebSocket] Error:', event);
            onError?.(new Error('WebSocket error'));
        };

        ws.onclose = () => {
            console.log('[WebSocket] Disconnected');
            setIsConnected(false);

            // Attempt to reconnect
            reconnectTimerRef.current = setTimeout(() => {
                console.log('[WebSocket] Attempting to reconnect...');
                connect();
            }, reconnectInterval);
        };

        wsRef.current = ws;
    };

    const disconnect = () => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
    };

    const send = (data: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        } else {
            console.warn('[WebSocket] Cannot send message, not connected');
        }
    };

    const subscribe = (channel: string, symbol?: string) => {
        send({ type: 'subscribe', channel, symbol });
    };

    useEffect(() => {
        connect();
        return () => disconnect();
    }, [url]);

    return { isConnected, lastMessage, send, subscribe, disconnect, reconnect: connect };
}
