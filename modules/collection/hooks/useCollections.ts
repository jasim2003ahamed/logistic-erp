import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionService } from '../services';
import { RecordPaymentFormValues } from '../types';

export function usePendingInvoices() {
    return useQuery({
        queryKey: ['pending-invoices'],
        queryFn: collectionService.getPendingInvoices,
    });
}

export function usePaymentHistory() {
    return useQuery({
        queryKey: ['payment-history'],
        queryFn: collectionService.getPaymentHistory,
    });
}

export function useRecordPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: RecordPaymentFormValues) => collectionService.recordPayment(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-invoices'] });
            queryClient.invalidateQueries({ queryKey: ['payment-history'] });
            queryClient.invalidateQueries({ queryKey: ['invoices'] }); // Also refresh main invoices list
        },
    });
}
