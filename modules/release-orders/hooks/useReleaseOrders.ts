import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { releaseOrderService } from '../services';
import { CreateReleaseOrderFormValues, ReleaseOrderStatus } from '../types';
import { useRouter } from 'next/navigation';

export function useReleaseOrders() {
    return useQuery({
        queryKey: ['release-orders'],
        queryFn: releaseOrderService.getReleaseOrders,
    });
}

export function useReleaseOrder(id: string) {
    return useQuery({
        queryKey: ['release-order', id],
        queryFn: () => releaseOrderService.getReleaseOrderById(id),
        enabled: !!id,
    });
}

export function useCreateReleaseOrder() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (values: CreateReleaseOrderFormValues) => releaseOrderService.createReleaseOrder(values),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['release-orders'] });
            router.push(`/release-order/${data.id}`);
        },
    });
}

export function useUpdateReleaseOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string, status: ReleaseOrderStatus }) =>
            releaseOrderService.updateStatus(id, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['release-orders'] });
            queryClient.invalidateQueries({ queryKey: ['release-order', variables.id] });
        },
    });
}
