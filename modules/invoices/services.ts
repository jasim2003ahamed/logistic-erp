import { createClient } from '@/lib/supabase/client';
import { CreateInvoiceFormValues, Invoice, InvoiceStatus } from './types';
import { quotationService } from '../quotations/services';

export const invoiceService = {
    // --- Invoices ---
    getInvoices: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('invoices')
            .select(`
        *,
        customer:customers(company_name)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Invoice[];
    },

    generateNextInvoiceNumber: async (): Promise<string> => {
        const supabase = createClient();
        const now = new Date();
        const year = now.getFullYear();
        // Month letter: A=January, B=February, C=March, ..., L=December
        const monthLetter = String.fromCharCode(65 + now.getMonth()); // 65 = 'A'
        // Day of month, zero-padded to 2 digits
        const day = now.getDate().toString().padStart(2, '0');

        // Prefix scoped to today: e.g. "DUS-2026-C-13"
        const todayPrefix = `DUS-${year}-${monthLetter}-${day}`;

        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('invoice_number')
                .like('invoice_number', `${todayPrefix}%`)
                .order('invoice_number', { ascending: false })
                .limit(1);

            if (error) {
                console.error("Supabase error in generateNextInvoiceNumber:", error);
                return `${todayPrefix}01`;
            }

            let nextSeq = 1;
            if (data && data.length > 0) {
                const lastInvoiceNumber = data[0].invoice_number;
                if (typeof lastInvoiceNumber === 'string') {
                    // Format: DUS-2026-C-1301  => last 2 chars are sequence "01"
                    // The sequence starts after todayPrefix (e.g. "DUS-2026-C-13")
                    const seqPart = lastInvoiceNumber.slice(todayPrefix.length);
                    const lastSeq = parseInt(seqPart, 10);
                    if (!isNaN(lastSeq)) {
                        nextSeq = lastSeq + 1;
                    }
                }
            }

            return `${todayPrefix}${nextSeq.toString().padStart(2, '0')}`;
        } catch (e) {
            console.error("Failed to generate next invoice number:", e);
            return `${todayPrefix}01`;
        }
    },

    generateNextJobNumber: async (): Promise<string> => {
        const supabase = createClient();
        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();

        // Format: DUS-JB-{DD}{MM}{YYYY}  e.g. "DUS-JB-13032026"
        const todayPrefix = `DUS-JB-${day}${month}${year}`;

        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('job_number')
                .like('job_number', `${todayPrefix}%`)
                .order('job_number', { ascending: false })
                .limit(1);

            if (error) {
                console.error("Supabase error in generateNextJobNumber:", error);
                return `${todayPrefix}01`;
            }

            let nextSeq = 1;
            if (data && data.length > 0) {
                const lastJobNumber = data[0].job_number;
                if (typeof lastJobNumber === 'string') {
                    const seqPart = lastJobNumber.slice(todayPrefix.length);
                    const lastSeq = parseInt(seqPart, 10);
                    if (!isNaN(lastSeq)) {
                        nextSeq = lastSeq + 1;
                    }
                }
            }

            return `${todayPrefix}${nextSeq.toString().padStart(2, '0')}`;
        } catch (e) {
            console.error("Failed to generate next job number:", e);
            return `${todayPrefix}01`;
        }
    },

    getInvoiceById: async (id: string) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('invoices')
            .select(`
        *,
        customer:customers(*),
        items:invoice_items(*),
        quotation:quotations(quotation_number) 
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Invoice;
    },

    createInvoice: async (formData: CreateInvoiceFormValues) => {
        const supabase = createClient();

        // 1. Generate Invoice Number & Job Number
        const [invoiceNumber, jobNumber] = await Promise.all([
            invoiceService.generateNextInvoiceNumber(),
            invoiceService.generateNextJobNumber(),
        ]);

        // 2. Calculate totals
        const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        const total = subtotal;

        // 3. Insert Invoice
        const { data: invoice, error: invError } = await supabase
            .from('invoices')
            .insert({
                invoice_number: invoiceNumber,
                customer_id: formData.customer_id,
                job_number: jobNumber,
                quotation_id: formData.quotation_id || null,
                parent_invoice_id: formData.parent_invoice_id || null,
                issue_date: formData.issue_date,
                due_date: formData.due_date || null,
                status: formData.status,
                terms: formData.terms || null,
                currency: formData.currency,

                service_modes: formData.service_modes,

                shipment_type: formData.shipment_type || null,
                hbl_hawb: formData.hbl_hawb || null,
                mbl_mawb: formData.mbl_mawb || null,
                vessel_flight: formData.vessel_flight || null,
                voyage_no: formData.voyage_no || null,
                pol: formData.pol || null,
                pod: formData.pod || null,
                vessel_pod: formData.vessel_pod || null,
                pickup_address: formData.pickup_address || null,
                delivery_address: formData.delivery_address || null,
                etd: formData.etd || null,
                eta: formData.eta || null,
                commodity: formData.commodity || null,
                hs_code: formData.hs_code || null,
                num_packages: formData.num_packages || null,
                gross_weight: formData.gross_weight || null,
                volume: formData.volume || null,
                container_type: formData.container_type || null,
                temperature: formData.temperature || null,

                imo_no: formData.imo_no || null,
                berth_anchorage: formData.berth_anchorage || null,
                vessel_delivery_date: formData.vessel_delivery_date || null,

                notes: formData.notes,
                subtotal_amount: subtotal,
                total_amount: total
            })
            .select()
            .single();

        if (invError) throw invError;

        // 3. Insert Items
        const itemsToInsert = formData.items.map(item => ({
            invoice_id: invoice.id,
            description: item.description,
            product_id: item.product_id || null,
            quantity: item.quantity,
            unit_price: item.unit_price,
            currency: item.currency || 'SGD',
            total_price: item.quantity * item.unit_price
        }));

        const { error: itemsError } = await supabase
            .from('invoice_items')
            .insert(itemsToInsert);

        if (itemsError) {
            console.error("Error creating invoice items", itemsError);
            throw itemsError;
        }

        return invoice;
    },

    generateFromQuotation: async (quotationId: string) => {
        // 1. Fetch Quotation
        const quotation = await quotationService.getQuotationById(quotationId);

        if (!quotation) throw new Error("Quotation not found");

        // 2. Map to Invoice Form Values
        // Note: We don't save DB immediately, we return form values for the user to review in "New Invoice" page
        const initialValues: Partial<CreateInvoiceFormValues> = {
            customer_id: quotation.customer_id,
            quotation_id: quotation.id,
            status: 'draft',
            issue_date: new Date().toISOString().split('T')[0],
            items: quotation.items?.map(item => ({
                product_id: item.product_id,
                description: item.product?.name || "Unknown Item",
                quantity: item.quantity,
                unit_price: item.unit_price,
                currency: 'SGD'
            })) || []
        };

        return initialValues;
    },

    updateStatus: async (id: string, status: InvoiceStatus) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('invoices')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    },

    updateInvoice: async (id: string, formData: CreateInvoiceFormValues) => {
        const supabase = createClient();

        // 1. Calculate totals
        const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        const total = subtotal;

        // 2. Update Invoice
        const { data: invoice, error: invError } = await supabase
            .from('invoices')
            .update({
                customer_id: formData.customer_id,
                job_number: formData.job_number || null,
                quotation_id: formData.quotation_id || null,
                parent_invoice_id: formData.parent_invoice_id || null,
                issue_date: formData.issue_date,
                due_date: formData.due_date || null,
                status: formData.status,
                terms: formData.terms || null,
                currency: formData.currency,

                service_modes: formData.service_modes,

                shipment_type: formData.shipment_type || null,
                hbl_hawb: formData.hbl_hawb || null,
                mbl_mawb: formData.mbl_mawb || null,
                vessel_flight: formData.vessel_flight || null,
                voyage_no: formData.voyage_no || null,
                pol: formData.pol || null,
                pod: formData.pod || null,
                vessel_pod: formData.vessel_pod || null,
                pickup_address: formData.pickup_address || null,
                delivery_address: formData.delivery_address || null,
                etd: formData.etd || null,
                eta: formData.eta || null,
                commodity: formData.commodity || null,
                hs_code: formData.hs_code || null,
                num_packages: formData.num_packages || null,
                gross_weight: formData.gross_weight || null,
                volume: formData.volume || null,
                container_type: formData.container_type || null,
                temperature: formData.temperature || null,

                imo_no: formData.imo_no || null,
                berth_anchorage: formData.berth_anchorage || null,
                vessel_delivery_date: formData.vessel_delivery_date || null,

                notes: formData.notes,
                subtotal_amount: subtotal,
                total_amount: total,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (invError) throw invError;

        // 3. Delete existing items
        const { error: deleteError } = await supabase
            .from('invoice_items')
            .delete()
            .eq('invoice_id', id);

        if (deleteError) throw deleteError;

        // 4. Insert new items
        const itemsToInsert = formData.items.map(item => ({
            invoice_id: id,
            description: item.description,
            product_id: item.product_id || null,
            quantity: item.quantity,
            unit_price: item.unit_price,
            currency: item.currency || 'SGD',
            total_price: item.quantity * item.unit_price
        }));

        const { error: itemsError } = await supabase
            .from('invoice_items')
            .insert(itemsToInsert);

        if (itemsError) throw itemsError;

        return invoice;
    },

    deleteInvoice: async (id: string) => {
        const supabase = createClient();

        const { error: itemsError } = await supabase
            .from('invoice_items')
            .delete()
            .eq('invoice_id', id);

        if (itemsError) throw itemsError;

        const { error } = await supabase
            .from('invoices')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
