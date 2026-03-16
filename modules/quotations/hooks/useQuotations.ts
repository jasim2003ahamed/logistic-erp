
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quotationService } from '../services';
import { CreateQuotationFormValues, QuotationStatus } from '../types';
import { useRouter } from 'next/navigation';

export function useCustomers() {
    return useQuery({
        queryKey: ['customers'],
        queryFn: quotationService.getCustomers,
    });
}

export function useProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: quotationService.getProducts,
    });
}

export function useQuotations() {
    return useQuery({
        queryKey: ['quotations'],
        queryFn: quotationService.getQuotations,
    });
}

export function useQuotation(id: string) {
    return useQuery({
        queryKey: ['quotation', id],
        queryFn: () => quotationService.getQuotationById(id),
        enabled: !!id,
    });
}

export function useCreateQuotation() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (data: CreateQuotationFormValues) => quotationService.createQuotation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotations'] });
            router.push('/quotations/list');
        },
    });
}

export function useUpdateQuotation() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: CreateQuotationFormValues }) =>
            quotationService.updateQuotation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotations'] });
            queryClient.invalidateQueries({ queryKey: ['quotation'] });
            router.push('/quotations/list');
        },
    });
}

export function useDeleteQuotation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => quotationService.deleteQuotation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotations'] });
        },
    });
}
