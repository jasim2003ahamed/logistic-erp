import { createClient } from '@/lib/supabase/client';

export const dashboardService = {
    getDashboardStats: async () => {
        const supabase = createClient();

        // 1. Total Revenue (Sum of paid invoices)
        const { data: revenueData, error: revenueError } = await supabase
            .from('invoices')
            .select('total_amount')
            .eq('status', 'paid');

        if (revenueError) throw revenueError;
        const totalRevenue = revenueData.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

        // 2. Pending Invoices Count (Not paid)
        const { count: pendingCount, error: pendingError } = await supabase
            .from('invoices')
            .select('*', { count: 'exact', head: true })
            .neq('status', 'paid');

        if (pendingError) throw pendingError;

        // 3. Pending Invoices Amount
        const { data: pendingInvoices, error: pendingAmountError } = await supabase
            .from('invoices')
            .select('total_amount')
            .neq('status', 'paid');

        if (pendingAmountError) throw pendingAmountError;
        const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

        // 4. Active Customers Count
        const { count: customerCount, error: customerError } = await supabase
            .from('customers')
            .select('*', { count: 'exact', head: true });

        if (customerError) throw customerError;

        // 5. Active Orders (Release Orders - pending/in-progress)
        const { count: orderCount, error: orderError } = await supabase
            .from('release_orders')
            .select('*', { count: 'exact', head: true })
            .neq('status', 'completed');

        if (orderError) throw orderError;

        return {
            totalRevenue,
            pendingCount: pendingCount || 0,
            pendingAmount,
            customerCount: customerCount || 0,
            orderCount: orderCount || 0,
        };
    },

    getRecentActivity: async () => {
        const supabase = createClient();

        // Fetch recent invoices
        const { data: invoices, error: invError } = await supabase
            .from('invoices')
            .select(`
                id,
                invoice_number,
                status,
                total_amount,
                created_at,
                customer:customers(company_name)
            `)
            .order('created_at', { ascending: false })
            .limit(5);

        if (invError) throw invError;

        return invoices.map(inv => {
            const customerData: any = inv.customer;
            const companyName = Array.isArray(customerData)
                ? customerData[0]?.company_name
                : customerData?.company_name;

            return {
                id: inv.id,
                type: 'invoice',
                title: inv.invoice_number,
                description: `Invoice created for ${companyName || 'unknown'}`,
                amount: inv.total_amount,
                status: inv.status,
                time: new Date(inv.created_at).toLocaleString(),
                initials: (companyName || 'U').substring(0, 2).toUpperCase(),
                userName: 'System'
            };
        });
    }
};
