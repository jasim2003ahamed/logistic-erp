'use client';

import Link from 'next/link';
import {
  Plus,
  FileText,
  ClipboardList,
  CreditCard,
  Package,
  Truck,
  PackageCheck,
  TrendingUp,
  Users,
  Clock,
  ArrowUpRight,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  // Mock data for initial design - in a real scenario, these would come from hooks
  const stats = [
    { name: 'Total Revenue', value: '₹4,25,000', change: '+12.5%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Active Quotations', value: '24', change: '+3 new', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Pending Invoices', value: '12', change: '₹85,000 total', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Due Collections', value: '₹1,12,000', change: '5 upcoming', icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const quickActions = [
    { name: 'New Quotation', href: '/quotations/new', icon: ClipboardList, description: 'Create a new cost estimation' },
    { name: 'Generate Invoice', href: '/invoices/new', icon: FileText, description: 'Convert quotation to invoice' },
    { name: 'New Release Order', href: '/release-order', icon: PackageCheck, description: 'Process stock release' },
    { name: 'Record Collection', href: '/collection', icon: CreditCard, description: 'Enter payment details' },
  ];

  const moduleStatus = [
    { name: 'Quotations', count: 145, status: 'Active', trend: 'up', color: 'bg-blue-500' },
    { name: 'Invoices', count: 89, status: 'In Review', trend: 'up', color: 'bg-amber-500' },
    { name: 'Logistics', count: 32, status: 'On Route', trend: 'steady', color: 'bg-emerald-500' },
    { name: 'Inventory', count: '92%', status: 'Available', trend: 'down', color: 'bg-indigo-500' },
  ];

  return (
    <div className="container mx-auto p-6 md:p-8 space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">COMMAND CENTER</h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-xs">Enterprise Logistics Control Suite</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-tighter">
            <Clock className="h-3 w-3" /> System Live
          </span>
          <Button variant="outline" size="sm" className="font-bold uppercase tracking-tighter border-slate-200">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow group overflow-hidden relative">
            <div className={`absolute top-0 right-0 h-24 w-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150 ${stat.bg.replace('50', '200')}`} />
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className={`text-xs font-bold ${stat.color} bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.name}</h3>
              <p className="text-3xl font-black text-slate-900 mt-1 tracking-tighter">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              Quick Actions <div className="h-1 w-1 rounded-full bg-blue-600" />
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}>
                <div className="group bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer relative overflow-hidden">
                  <div className="p-3 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{action.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>

          {/* Module Status Mini Card */}
          <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <CardTitle className="text-xs font-black uppercase tracking-[3px] text-blue-400">Inventory Status</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-end justify-between mb-2">
                <span className="text-4xl font-black tabular-nums tracking-tighter">92.4%</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center mb-2">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +2.1%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[92.4%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Module Overview & Reports */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              Module Analytics <div className="h-1 w-1 rounded-full bg-emerald-600" />
            </h2>
            <Link href="/analytics" className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">
              View Full Report
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moduleStatus.map((module, i) => (
              <div key={i} className="bg-white border border-slate-100 p-5 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-all border-l-4" style={{ borderColor: module.color.replace('bg-', '') }}>
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">{module.name}</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{module.count}</h3>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[1px] px-2 py-1 rounded bg-slate-50 text-slate-500 border border-slate-100`}>
                    {module.status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(user => (
                      <div key={user} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-br from-slate-400 to-slate-500" />
                      </div>
                    ))}
                    <div className="h-6 w-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400">
                      +5
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Assigned</p>
                </div>
              </div>
            ))}
          </div>

          {/* Wide Banner / Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-500/20 overflow-hidden relative group">
            <div className="absolute top-0 right-0 h-64 w-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
            <div className="relative z-10 space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-black tracking-tight leading-none uppercase italic">Global Logistics Intelligence</h3>
              <p className="text-blue-100 text-sm font-medium opacity-80 uppercase tracking-widest">Connect your entire supply chain in one platform</p>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-slate-50 font-black uppercase tracking-[2px] rounded-2xl px-8 h-12 relative z-10 shadow-lg group-hover:scale-105 transition-transform">
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
