import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryOrderService } from '../services';
import { CreateDeliveryOrderFormValues, DeliveryOrderStatus } from '../types';
import { useRouter } from 'next/navigation';

export function useDeliveryOrders() {
    return useQuery({
        queryKey: ['delivery-orders'],
        queryFn: deliveryOrderService.getDeliveryOrders,
    });
}

export function useDeliveryOrder(id: string) {
    return useQuery({
        queryKey: ['delivery-order', id],
        queryFn: () => deliveryOrderService.getDeliveryOrderById(id),
        enabled: !!id,
    });
}

export function useCreateDeliveryOrder() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (values: CreateDeliveryOrderFormValues) => deliveryOrderService.createDeliveryOrder(values),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['delivery-orders'] });
            router.push(`/delivery-order/${data.id}`);
        },
    });
}

export function useUpdateDeliveryOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string, status: DeliveryOrderStatus }) =>
            deliveryOrderService.updateStatus(id, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['delivery-orders'] });
            queryClient.invalidateQueries({ queryKey: ['delivery-order', variables.id] });
        },
    });
}
