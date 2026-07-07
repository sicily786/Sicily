'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { BarChart3, Download, TrendingUp, MapPin, Package, RefreshCw, CreditCard, XCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase';

interface OrderRow {
  id: string;
  order_number: string;
  total: number;
  payment_method: string;
  order_status: string;
  district: string;
  created_at: string;
}

interface ItemRow {
  order_id: string;
  product_name: string;
  qty: number;
  price: number;
}

type RangeKey = 'today' | 'week' | 'month' | 'all';

export default function AdminReportsPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [range, setRange] = useState<RangeKey>('week');

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const [ordersRes, itemsRes] = await Promise.all([
        supabase.from('orders').select('id, order_number, total, payment_method, order_status, district, created_at').order('created_at', { ascending: false }),
        supabase.from('order_items').select('order_id, product_name, qty, price'),
      ]);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (itemsRes.data) setItems(itemsRes.data);
      setLoading(false);
    };
    load();
  }, []);

  const rangeStart = (key: RangeKey): Date => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    if (key === 'week') d.setDate(d.getDate() - 6);
    if (key === 'month') d.setDate(d.getDate() - 29);
    if (key === 'all') return new Date(0);
    return d;
  };

  const start = rangeStart(range);
  const filteredOrders = orders.filter((o) => new Date(o.created_at) >= start);
  const filteredOrderIds = new Set(filteredOrders.map((o) => o.id));
  const filteredItems = items.filter((i) => filteredOrderIds.has(i.order_id));

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const codCount = filteredOrders.filter((o) => o.payment_method === 'cod').length;
  const onlineCount = totalOrders - codCount;
  const cancelledCount = filteredOrders.filter((o) => o.order_status === 'cancelled' || o.order_status === 'returned').length;
  const cancelRate = totalOrders > 0 ? Math.round((cancelledCount / totalOrders) * 100) : 0;

  const districtTotals = new Map<string, number>();
  filteredOrders.forEach((o) => districtTotals.set(o.district, (districtTotals.get(o.district) || 0) + 1));
  const topDistricts = Array.from(districtTotals.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const productTotals = new Map<string, number>();
  filteredItems.forEach((i) => productTotals.set(i.product_name, (productTotals.get(i.product_name) || 0) + i.qty));
  const topProducts = Array.from(productTotals.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const maxDistrict = Math.max(...topDistricts.map((d) => d[1]), 1);
  const maxProduct = Math.max(...topProducts.map((p) => p[1]), 1);

  const handleExportCSV = () => {
    const header = 'Order Number,Date,District,Payment Method,Status,Total\n';
    const rows = filteredOrders.map((o) =>
      `${o.order_number},${new Date(o.created_at).toLocaleDateString()},${o.district},${o.payment_method},${o.order_status},${o.total}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sicily_report_${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const rangeLabels: Record<RangeKey, { en: string; bn: string }> = {
    today: { en: 'Today', bn: 'আজ' },
    week: { en: 'This Week', bn: 'এই সপ্তাহ' },
    month: { en: 'This Month', bn: 'এই মাস' },
    all: { en: 'All Time', bn: 'সর্বমোট' },
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-brand-border pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-text flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-brand-primary" />
            <span>{isBn ? 'অ্যানালিটিক্স ও রিপোর্টস' : 'Analytics & Performance'}</span>
          </h1>
          <p className="text-xs text-brand-muted mt-1.5 font-medium">
            {isBn ? 'রেভিনিউ, পেমেন্ট ব্রেকডাউন, জনপ্রিয় জেলা ও প্রোডাক্ট ট্র্যাক করুন।' : 'Revenue, payment breakdown, top districts, and best-selling products.'}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-border bg-white text-brand-text hover:border-brand-primary hover:text-brand-primary font-bold text-xs shadow-sm transition-all-custom"
        >
          <Download className="h-4 w-4" />
          <span>{isBn ? 'CSV এক্সপোর্ট করুন' : 'Export CSV'}</span>
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {(Object.keys(rangeLabels) as RangeKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setRange(key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all-custom border ${
              range === key
                ? 'bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/10'
                : 'bg-white border-brand-border text-brand-text hover:border-brand-primary/30'
            }`}
          >
            {isBn ? rangeLabels[key].bn : rangeLabels[key].en}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: isBn ? 'মোট রেভিনিউ' : 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: TrendingUp },
          { label: isBn ? 'মোট অর্ডার' : 'Total Orders', value: `${totalOrders}`, icon: Package },
          { label: isBn ? 'গড় অর্ডার মূল্য' : 'Avg Order Value', value: `৳${avgOrderValue}`, icon: CreditCard },
          { label: isBn ? 'বাতিল/ফেরত হার' : 'Cancel/Return Rate', value: `${cancelRate}%`, icon: XCircle },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-brand-muted uppercase">{stat.label}</span>
                <Icon className="h-4 w-4 text-brand-primary" />
              </div>
              <span className="text-xl font-serif font-bold text-brand-text">{loading ? '—' : stat.value}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* COD vs Online */}
        <div className="bg-white border border-brand-border rounded-3xl p-6 space-y-6 shadow-sm">
          <h3 className="font-extrabold text-brand-text text-sm flex items-center gap-2">
            <CreditCard className="h-4.5 w-4.5 text-brand-primary" />
            <span>{isBn ? 'পেমেন্ট পদ্ধতি ব্রেকডাউন' : 'Payment Method Breakdown'}</span>
          </h3>
          <div className="space-y-4">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-brand-text">
                <span>{isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
                <span className="text-brand-primary">{codCount} ({totalOrders > 0 ? Math.round((codCount / totalOrders) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-brand-surface border border-brand-border overflow-hidden">
                <div className="h-full bg-brand-primary rounded-full" style={{ width: `${totalOrders > 0 ? (codCount / totalOrders) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-brand-text">
                <span>{isBn ? 'অনলাইন পেমেন্ট' : 'Online Payment'}</span>
                <span className="text-brand-secondary">{onlineCount} ({totalOrders > 0 ? Math.round((onlineCount / totalOrders) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-brand-surface border border-brand-border overflow-hidden">
                <div className="h-full bg-brand-secondary rounded-full" style={{ width: `${totalOrders > 0 ? (onlineCount / totalOrders) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Districts */}
        <div className="bg-white border border-brand-border rounded-3xl p-6 space-y-6 shadow-sm">
          <h3 className="font-extrabold text-brand-text text-sm flex items-center gap-2">
            <MapPin className="h-4.5 w-4.5 text-brand-primary" />
            <span>{isBn ? 'শীর্ষ জেলাসমূহ' : 'Top Districts'}</span>
          </h3>
          {topDistricts.length === 0 ? (
            <p className="text-xs text-brand-muted font-semibold">{isBn ? 'কোনো ডেটা নেই।' : 'No data yet.'}</p>
          ) : (
            <div className="space-y-3">
              {topDistricts.map(([district, count]) => (
                <div key={district} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-brand-text">
                    <span>{district}</span>
                    <span className="text-brand-primary">{count} {isBn ? 'অর্ডার' : 'orders'}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-brand-surface border border-brand-border overflow-hidden">
                    <div className="h-full bg-brand-primary rounded-full" style={{ width: `${(count / maxDistrict) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white border border-brand-border rounded-3xl p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-brand-border pb-3">
          <RefreshCw className="h-5 w-5 text-brand-primary" />
          <h3 className="font-extrabold text-brand-text text-base">
            {isBn ? 'সর্বাধিক বিক্রিত প্রোডাক্ট' : 'Best-Selling Products'}
          </h3>
        </div>

        {topProducts.length === 0 ? (
          <p className="text-xs text-brand-muted font-semibold text-center py-4">
            {isBn ? 'এই সময়সীমায় কোনো বিক্রি নেই।' : 'No sales in this date range.'}
          </p>
        ) : (
          <div className="space-y-3">
            {topProducts.map(([name, qty]) => (
              <div key={name} className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-brand-text">
                  <span>{name}</span>
                  <span className="text-brand-primary">{qty} {isBn ? 'পিস' : 'sold'}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-brand-surface border border-brand-border overflow-hidden">
                  <div className="h-full bg-brand-primary rounded-full" style={{ width: `${(qty / maxProduct) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
