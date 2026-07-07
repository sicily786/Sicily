'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Users, Ban, CheckCircle2, Star, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  is_blocked: boolean;
  orders: number;
  spent: number;
}

export default function AdminCustomersPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadCustomers = async () => {
    const supabase = createClient();
    const [customersRes, ordersRes] = await Promise.all([
      supabase.from('customers').select('id, name, phone, email, is_blocked'),
      supabase.from('orders').select('customer_id, total').not('customer_id', 'is', null),
    ]);

    if (customersRes.data) {
      const totals = new Map<string, { orders: number; spent: number }>();
      (ordersRes.data || []).forEach((o) => {
        const cur = totals.get(o.customer_id) || { orders: 0, spent: 0 };
        cur.orders += 1;
        cur.spent += Number(o.total);
        totals.set(o.customer_id, cur);
      });

      const merged = customersRes.data.map((c) => ({
        ...c,
        orders: totals.get(c.id)?.orders || 0,
        spent: totals.get(c.id)?.spent || 0,
      }));
      setCustomers(merged);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleToggleBlock = async (id: string, currentlyBlocked: boolean) => {
    const confirmAction = window.confirm(
      isBn
        ? `আপনি কি নিশ্চিতভাবে এই কাস্টমারকে ${currentlyBlocked ? 'আনব্লক' : 'ব্লক'} করতে চান?`
        : `Are you sure you want to ${currentlyBlocked ? 'unblock' : 'block'} this customer?`
    );
    if (!confirmAction) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('customers')
      .update({ is_blocked: !currentlyBlocked })
      .eq('id', id);

    if (!error) {
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, is_blocked: !currentlyBlocked } : c)));
    }
  };

  const getTag = (c: Customer): 'vip' | 'repeat' | 'regular' => {
    if (c.spent >= 5000) return 'vip';
    if (c.orders >= 2) return 'repeat';
    return 'regular';
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-brand-border pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-brand-text flex items-center gap-2">
            <Users className="h-6 w-6 text-brand-primary" />
            <span>{isBn ? 'কাস্টমার ডিরেক্টরি' : 'Customer Directory'}</span>
          </h1>
          <p className="text-xs text-brand-muted mt-1.5 font-medium">
            {isBn ? 'স্টোরের নিবন্ধিত কাস্টমারদের তালিকা, অর্ডার হিস্টোরি এবং ফ্রড প্রোফাইল মনিটর করুন।' : 'Monitor buyer portfolios, purchase values, and toggle spam flags/blocks.'}
          </p>
        </div>
      </div>

      {/* Filter and Search queries */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-brand-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isBn ? 'নাম বা ফোন নম্বর দিয়ে খুঁজুন...' : 'Search by buyer name or mobile...'}
          className="w-full bg-white border border-brand-border rounded-xl py-2 pl-9 pr-4 text-xs text-brand-text outline-none focus:border-brand-primary transition-all-custom font-bold"
        />
      </div>

      {/* Table Container */}
      <div className="bg-white border border-brand-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-brand-border bg-brand-surface/40 text-brand-muted font-bold">
                <th className="py-4 px-5">{isBn ? 'গ্রাহক' : 'Customer'}</th>
                <th className="py-4 px-5">{isBn ? 'অর্ডার সংখ্যা' : 'Orders'}</th>
                <th className="py-4 px-5">{isBn ? 'মোট খরচ' : 'Total Spent'}</th>
                <th className="py-4 px-5">{isBn ? 'স্ট্যাটাস ট্যাগ' : 'Tags'}</th>
                <th className="py-4 px-5 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-brand-muted font-bold">
                    {isBn ? 'লোড হচ্ছে...' : 'Loading...'}
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-brand-muted font-bold">
                    {isBn ? 'কোনো গ্রাহক পাওয়া যায়নি।' : 'No customers matching search criteria.'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const tag = getTag(c);
                  let tagColor = 'bg-gray-50 border-gray-100 text-brand-text';
                  if (tag === 'vip') tagColor = 'bg-amber-50 border-amber-100 text-amber-700 font-extrabold';
                  else if (tag === 'repeat') tagColor = 'bg-blue-50 border-blue-100 text-blue-700';

                  return (
                    <tr key={c.id} className="hover:bg-brand-surface/40">
                      <td className="py-3.5 px-5">
                        <div>
                          <span className="font-extrabold text-brand-text text-xs block">{c.name}</span>
                          <span className="text-[9px] text-brand-muted block mt-0.5">{c.phone}{c.email ? ` · ${c.email}` : ''}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-bold text-brand-text">{c.orders} {isBn ? 'টি' : 'orders'}</td>
                      <td className="py-3.5 px-5 font-black text-brand-primary">৳{c.spent}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex gap-1.5 flex-wrap">
                          {c.is_blocked ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500 border border-red-600 text-white flex items-center gap-1 uppercase tracking-wide">
                              <Ban className="h-3 w-3" />
                              <span>{isBn ? 'ব্লকড' : 'Blocked'}</span>
                            </span>
                          ) : (
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border capitalize ${tagColor}`}>
                              {tag === 'vip' && <Star className="h-2.5 w-2.5 inline mr-1 fill-current align-text-bottom" />}
                              {tag}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleToggleBlock(c.id, c.is_blocked)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-extrabold transition-all-custom ${
                            c.is_blocked
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                          }`}
                        >
                          {c.is_blocked ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>{isBn ? 'আনব্লক করুন' : 'Unblock'}</span>
                            </>
                          ) : (
                            <>
                              <Ban className="h-3.5 w-3.5" />
                              <span>{isBn ? 'ব্লক করুন' : 'Block Client'}</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
