'use client';

import Link from 'next/link';
import {
  TrendingUp,
  Users,
  CreditCard,
  Package,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  DollarSign,
  ShoppingCart,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from '@/modules/products/components/product-form';
import { CustomerForm } from '@/modules/customers/components/customer-form';

import { dashboardService } from '@/modules/dashboard/services';
import { useEffect } from 'react';

export default function DashboardPage() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingCount: 0,
    pendingAmount: 0,
    customerCount: 0,
    orderCount: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, activityData] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentActivity()
        ]);
        setStats(statsData);
        setRecentActivity(activityData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your logistics operations and performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden sm:flex">
            <Clock className="mr-2 h-4 w-4" />
            Last 24 Hours
          </Button>
          <Button>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue (Paid)"
          value={loading ? "..." : formatAmount(stats.totalRevenue)}
          change="+0%"
          trend="neutral"
          icon={DollarSign}
          description="Collected to date"
          gradient="from-indigo-500/10 via-purple-500/10 to-pink-500/10"
          iconColor="text-indigo-600"
        />
        <KpiCard
          title="Active Orders"
          value={loading ? "..." : stats.orderCount}
          change="Pending/Working"
          trend="neutral"
          icon={ShoppingCart}
          description="Release orders in progress"
          gradient="from-blue-500/10 via-cyan-500/10 to-teal-500/10"
          iconColor="text-blue-600"
        />
        <KpiCard
          title="Pending Invoices"
          value={loading ? "..." : stats.pendingCount}
          change={stats.pendingAmount > 0 ? formatAmount(stats.pendingAmount) : "Outstanding"}
          trend="neutral"
          icon={CreditCard}
          description="Awaiting payment"
          gradient="from-amber-500/10 via-orange-500/10 to-yellow-500/10"
          iconColor="text-amber-600"
        />
        <KpiCard
          title="Total Customers"
          value={loading ? "..." : stats.customerCount}
          change="Registered"
          trend="neutral"
          icon={Users}
          description="Total client database"
          gradient="from-emerald-500/10 via-green-500/10 to-teal-500/10"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">

        {/* Left Column: Analytics & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Analytics Chart Placeholder - representing a modern chart area */}
          <Card className="col-span-4 shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Monthly revenue performance vs targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gradient-to-b from-primary/5 to-transparent rounded-lg border border-border/50 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                <div className="text-muted-foreground text-sm font-medium animate-pulse">
                  Interactive Chart Visualization
                </div>
                {/* Decorative abstract chart lines */}
                <svg className="absolute bottom-0 left-0 right-0 h-32 w-full text-primary/20" preserveAspectRatio="none">
                  <path d="M0,128 L40,110 C80,92 160,56 240,64 C320,72 400,124 480,118 C560,112 640,48 720,42 C800,36 880,88 960,100 C1040,112 1120,84 1200,60 C1280,36 1360,16 1400,6 L1440,0 V128 H0 Z" fill="currentColor" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionCard
              title="Create Quotation"
              description="Draft a new cost estimation for approval."
              href="/quotations/new"
              icon={Activity}
              color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
            />
            <ActionCard
              title="Add Product"
              description="Register new inventory items to the system."
              onClick={() => setIsProductModalOpen(true)}
              icon={Package}
              color="bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300"
            />
            <ActionCard
              title="New Customer"
              description="Onboard a new client partner."
              onClick={() => setIsCustomerModalOpen(true)}
              icon={Users}
              color="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
            />
            <ActionCard
              title="Generate Invoice"
              description="Convert approved quotations to invoices."
              href="/invoices/new"
              icon={CreditCard}
              color="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
            />
          </div>

          <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Enter the details of the new product SKU.
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                onSuccess={() => setIsProductModalOpen(false)}
                onCancel={() => setIsProductModalOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Enter the details of the new customer below.
                </DialogDescription>
              </DialogHeader>
              <CustomerForm
                onSuccess={() => setIsCustomerModalOpen(false)}
                onCancel={() => setIsCustomerModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Right Column: Recent Activity (3 cols) */}
        <div className="lg:col-span-3 space-y-8">
          <Card className="h-full shadow-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <CardDescription>Latest system transactions</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-8">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, idx) => (
                    <ActivityItem
                      key={activity.id || idx}
                      user={{ name: activity.userName, initials: activity.initials }}
                      action={activity.description}
                      target={activity.title}
                      time={activity.time}
                      amount={activity.amount ? formatAmount(activity.amount) : undefined}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activity found.</p>
                )}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-muted-foreground" asChild>
                <Link href="/invoices">
                  View All Activity <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Sub-components for cleaner code
function KpiCard({ title, value, change, trend, icon: Icon, description, gradient, iconColor }: any) {
  return (
    <Card className={`relative overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all duration-300`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`}></div>
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start">
          <div className={`p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          {trend === 'up' && <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full">{change} <ArrowUpRight className="ml-1 h-3 w-3" /></span>}
          {trend === 'down' && <span className="flex items-center text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-2 py-1 rounded-full">{change} <ArrowDownRight className="ml-1 h-3 w-3" /></span>}
          {trend === 'neutral' && <span className="flex items-center text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-full">{change}</span>}
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tracking-tight">{value}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionCard({ title, description, href, onClick, icon: Icon, color }: any) {
  const content = (
    <div
      onClick={onClick}
      className="group flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card hover:border-primary/20 hover:bg-muted/50 transition-all cursor-pointer"
    >
      <div className={`mt-1 p-2 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function ActivityItem({ user, action, target, time, amount, type = 'default' }: any) {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-9 w-9 border border-border">
        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.initials}`} alt={user.name} />
        <AvatarFallback>{user.initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 w-full">
        <p className="text-sm">
          <span className="font-semibold text-foreground">{user.name}</span>
          <span className="text-muted-foreground ml-1">{action}</span>
          <span className="font-medium text-foreground ml-1">{target}</span>
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{time}</span>
          {amount && <span className="text-xs font-semibold text-foreground">{amount}</span>}
        </div>
      </div>
    </div>
  )
}

function KpiChart() {
  return (
    <div className="h-full w-full bg-slate-100 rounded-lg flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Chart Placeholder</p>
    </div>
  )
}
