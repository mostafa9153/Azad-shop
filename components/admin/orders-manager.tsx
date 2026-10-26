"use client";

import { useState } from "react";
import { Locale, formatPrice } from "@/lib/i18n";
import { Order, OrderStatus, PaymentStatus } from "@/lib/types";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Phone,
  MapPin,
  Calendar,
  X,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

interface OrdersManagerProps {
  locale: Locale;
  initialOrders: Order[];
}

export function OrdersManager({ locale, initialOrders }: OrdersManagerProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search);

    if (!matchesSearch) return false;
    if (statusFilter !== "all" && o.order_status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    newPayment?: PaymentStatus
  ) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_status: newStatus,
          payment_status: newPayment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                order_status: newStatus,
                payment_status: newPayment || o.payment_status,
              }
            : o
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                order_status: newStatus,
                payment_status: newPayment || prev.payment_status,
              }
            : null
        );
      }
    } catch (err: any) {
      alert(err.message || "Status update failed");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] inline-flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            <span>{locale === "bn" ? "প্রক্রিয়াকরণ" : "Processing"}</span>
          </span>
        );
      case "tailoring":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px] inline-flex items-center gap-1">
            <span>✂️</span>
            <span>{locale === "bn" ? "দরজি কিউতে" : "Tailoring"}</span>
          </span>
        );
      case "shipped":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] inline-flex items-center gap-1">
            <Truck className="w-2.5 h-2.5" />
            <span>{locale === "bn" ? "কুরিয়ারে প্রেরিত" : "Shipped"}</span>
          </span>
        );
      case "delivered":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>{locale === "bn" ? "ডেলিভারি সম্পন্ন" : "Delivered"}</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[10px] inline-flex items-center gap-1">
            <AlertCircle className="w-2.5 h-2.5" />
            <span>{locale === "bn" ? "বাতিল" : "Cancelled"}</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 font-bold text-[10px]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E9DDC9] shadow-2xs flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              locale === "bn"
                ? "অর্ডার নম্বর, ক্রেতার নাম বা মোবাইল..."
                : "Search by Order #, Name or Phone..."
            }
            className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#14372E]"
          />
          <Search className="w-3.5 h-3.5 text-[#1C1B18]/50 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: locale === "bn" ? "সব" : "All" },
            { id: "processing", label: locale === "bn" ? "প্রসেসিং" : "Processing" },
            { id: "tailoring", label: locale === "bn" ? "দরজি কিউ" : "Tailoring" },
            { id: "shipped", label: locale === "bn" ? "শিপড" : "Shipped" },
            { id: "delivered", label: locale === "bn" ? "ডেলিভার্ড" : "Delivered" },
            { id: "cancelled", label: locale === "bn" ? "বাতিল" : "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === tab.id
                  ? "bg-[#14372E] text-white font-bold shadow-xs"
                  : "bg-[#FBF7F0] border border-[#E9DDC9] text-[#1C1B18] hover:bg-[#E9DDC9]/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E9DDC9] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#14372E] text-[#FBF7F0]">
              <tr>
                <th className="py-3 px-4">{locale === "bn" ? "অর্ডার নম্বর" : "Order #"}</th>
                <th className="py-3 px-4">{locale === "bn" ? "তারিখ" : "Date"}</th>
                <th className="py-3 px-4">{locale === "bn" ? "ক্রেতা ও ফোন" : "Customer & Phone"}</th>
                <th className="py-3 px-4">{locale === "bn" ? "পেমেন্ট" : "Payment"}</th>
                <th className="py-3 px-4 text-center">{locale === "bn" ? "মোট মূল্য" : "Grand Total"}</th>
                <th className="py-3 px-4 text-center">{locale === "bn" ? "অর্ডার স্ট্যাটাস" : "Order Status"}</th>
                <th className="py-3 px-4 text-right">{locale === "bn" ? "অ্যাকশন" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9DDC9]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#1C1B18]/60">
                    {locale === "bn" ? "কোন অর্ডার পাওয়া যায়নি।" : "No orders match criteria."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FBF7F0]/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#14372E]">
                      {o.order_number}
                    </td>
                    <td className="py-3 px-4 text-[#1C1B18]/70 whitespace-nowrap">
                      {new Date(o.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#1C1B18]">{o.customer_name}</p>
                      <p className="font-mono text-[11px] text-[#1C1B18]/60">{o.customer_phone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold uppercase tracking-wider text-[10px]">
                          {o.payment_method}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            o.payment_status === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : o.payment_status === "refunded"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {o.payment_status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-sm text-[#14372E]">
                      {formatPrice(o.total_paise, locale)}
                    </td>
                    <td className="py-3 px-4 text-center">{getStatusBadge(o.order_status)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-1.5 rounded-lg bg-[#14372E]/10 hover:bg-[#14372E]/20 text-[#14372E] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/${locale}/invoice/${o.order_number}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#14372E] transition-colors"
                          title="Print GST Tax Invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL / DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#E9DDC9] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-1.5 text-[#1C1B18]/60 hover:text-[#1C1B18] rounded-xl bg-[#FBF7F0]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between pb-4 border-b border-[#E9DDC9]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A8834A]">
                  {locale === "bn" ? "অর্ডার বিবরণী" : "Order Specification"}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#14372E]">
                  {selectedOrder.order_number}
                </h3>
              </div>

              <Link
                href={`/${locale}/invoice/${selectedOrder.order_number}`}
                target="_blank"
                className="mr-8 px-3 py-1.5 rounded-xl bg-[#14372E] text-white text-xs font-semibold hover:bg-[#14372E]/90 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "ট্যাক্স ইনভয়েস প্রিন্ট" : "Print Tax Invoice"}</span>
              </Link>
            </div>

            {/* Quick Status Control */}
            <div className="my-5 p-4 rounded-2xl bg-[#FBF7F0] border border-[#E9DDC9] space-y-3">
              <span className="text-xs font-bold text-[#14372E] block">
                {locale === "bn" ? "অর্ডার স্ট্যাটাস দ্রুত পরিবর্তন করুন:" : "Quick Status Update:"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1C1B18]/70 mb-1">
                    {locale === "bn" ? "ডেলিভারি স্ট্যাটাস" : "Order Fulfillment"}
                  </label>
                  <select
                    value={selectedOrder.order_status}
                    disabled={updating}
                    onChange={(e) =>
                      handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)
                    }
                    className="w-full bg-white border border-[#E9DDC9] rounded-xl px-3 py-1.5 text-xs font-bold text-[#14372E] focus:outline-none"
                  >
                    <option value="processing">প্রসেসিং (Processing)</option>
                    <option value="tailoring">দরজি কিউ (Tailoring)</option>
                    <option value="shipped">কুরিয়ারে প্রেরিত (Shipped)</option>
                    <option value="delivered">ডেলিভারি সম্পন্ন (Delivered)</option>
                    <option value="cancelled">বাতিল (Cancelled)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1C1B18]/70 mb-1">
                    {locale === "bn" ? "পেমেন্ট স্ট্যাটাস" : "Payment Status"}
                  </label>
                  <select
                    value={selectedOrder.payment_status}
                    disabled={updating}
                    onChange={(e) =>
                      handleUpdateStatus(
                        selectedOrder.id,
                        selectedOrder.order_status,
                        e.target.value as PaymentStatus
                      )
                    }
                    className="w-full bg-white border border-[#E9DDC9] rounded-xl px-3 py-1.5 text-xs font-bold text-[#14372E] focus:outline-none"
                  >
                    <option value="pending">পেন্ডিং (Pending)</option>
                    <option value="paid">পরিশোধিত (Paid)</option>
                    <option value="refunded">রিফান্ড সম্পন্ন (Refunded)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Customer & Shipping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#E9DDC9] text-xs">
              <div>
                <span className="font-bold text-[#14372E] block mb-1">
                  {locale === "bn" ? "ক্রেতার তথ্য" : "Customer Details"}
                </span>
                <p className="font-semibold text-[#1C1B18]">{selectedOrder.customer_name}</p>
                <p className="flex items-center gap-1.5 text-[#1C1B18]/70 mt-1">
                  <Phone className="w-3.5 h-3.5 text-[#A8834A]" />
                  <span>{selectedOrder.customer_phone}</span>
                </p>
                {selectedOrder.customer_email && (
                  <p className="text-[#1C1B18]/60 mt-0.5">{selectedOrder.customer_email}</p>
                )}
              </div>

              <div>
                <span className="font-bold text-[#14372E] block mb-1">
                  {locale === "bn" ? "ডেলিভারি ঠিকানা" : "Shipping Destination"}
                </span>
                <p className="text-[#1C1B18]/80 leading-relaxed">
                  {selectedOrder.shipping_address.address_line1}
                  {selectedOrder.shipping_address.address_line2 && `, ${selectedOrder.shipping_address.address_line2}`}
                  <br />
                  {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} —{" "}
                  <span className="font-mono font-bold text-[#14372E]">
                    {selectedOrder.shipping_address.pincode}
                  </span>
                </p>
              </div>
            </div>

            {/* Itemized List */}
            <div className="py-4 space-y-3">
              <span className="font-bold text-xs text-[#14372E] block">
                {locale === "bn" ? "অর্ডারের পণ্যসমূহ" : "Order Items"}
              </span>

              <div className="divide-y divide-[#E9DDC9] border border-[#E9DDC9] rounded-2xl overflow-hidden">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="p-3.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-serif font-bold text-[#14372E]">
                        {locale === "bn" ? item.title_bn : item.title_en}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#1C1B18]/70 mt-0.5">
                        <span className="font-mono">{item.sku}</span>
                        <span>•</span>
                        <span>Size: {item.size}</span>
                        <span>•</span>
                        <span>Qty: {item.quantity}</span>
                        {item.is_custom_size && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold text-[9px]">
                            Custom Size (+₹150)
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="font-bold text-[#14372E] font-mono">
                      {formatPrice(item.total_paise, locale)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-2xl bg-[#FBF7F0] border border-[#E9DDC9] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#1C1B18]/70">
                <span>{locale === "bn" ? "পণ্য সামগ্রী মূল্য:" : "Items Subtotal:"}</span>
                <span>{formatPrice(selectedOrder.items_total_paise, locale)}</span>
              </div>
              {selectedOrder.discount_total_paise > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{locale === "bn" ? "কুপন ছাড়:" : "Coupon Discount:"}</span>
                  <span>-{formatPrice(selectedOrder.discount_total_paise, locale)}</span>
                </div>
              )}
              {selectedOrder.custom_size_fee_paise > 0 && (
                <div className="flex justify-between text-purple-700 font-semibold">
                  <span>{locale === "bn" ? "কাস্টম দরজি ফি:" : "Custom Tailoring Fee:"}</span>
                  <span>+{formatPrice(selectedOrder.custom_size_fee_paise, locale)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#1C1B18]/70">
                <span>{locale === "bn" ? "শিপিং চার্জ:" : "Delivery Charge:"}</span>
                <span>
                  {selectedOrder.shipping_fee_paise === 0
                    ? locale === "bn"
                      ? "বিনামূল্যে (Free)"
                      : "FREE"
                    : formatPrice(selectedOrder.shipping_fee_paise, locale)}
                </span>
              </div>
              {selectedOrder.cod_fee_paise > 0 && (
                <div className="flex justify-between text-[#1C1B18]/70">
                  <span>{locale === "bn" ? "COD হ্যান্ডলিং ফি:" : "COD Convenience:"}</span>
                  <span>+{formatPrice(selectedOrder.cod_fee_paise, locale)}</span>
                </div>
              )}
              <div className="border-t border-[#E9DDC9] pt-2 flex justify-between font-bold text-sm text-[#14372E]">
                <span>{locale === "bn" ? "সর্বমোট প্রদেয়:" : "Grand Total:"}</span>
                <span>{formatPrice(selectedOrder.total_paise, locale)}</span>
              </div>
              <p className="text-[10px] text-[#A8834A] text-right">
                {locale === "bn"
                  ? `(জিএসটি অন্তর্ভুক্ত: ${formatPrice(selectedOrder.gst_total_paise, locale)})`
                  : `(Includes GST: ${formatPrice(selectedOrder.gst_total_paise, locale)})`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
