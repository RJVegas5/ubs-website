import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const customer_id = searchParams.get("customer_id");

  let query = supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (customer_id) query = query.eq("customer_id", customer_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const body = await req.json();
  const { items, ...invoiceData } = body;

  const invoiceNumber = `INV-${Date.now()}`;

  const subtotal = (items ?? []).reduce(
    (sum: number, item: { total?: number; quantity?: number; unit_price?: number }) =>
      sum + (item.total ?? (item.quantity ?? 0) * (item.unit_price ?? 0)),
    0
  );
  const taxRate = invoiceData.tax_rate ?? 8.375;
  const taxAmount = subtotal * (taxRate / 100);
  const discountAmount = invoiceData.discount_amount ?? 0;
  const total = subtotal + taxAmount - discountAmount;

  const invoice = {
    ...invoiceData,
    invoice_number: invoiceNumber,
    subtotal,
    tax_rate: taxRate,
    tax_amount: taxAmount,
    discount_amount: discountAmount,
    total,
    amount_paid: 0,
    balance_due: total,
    status: "draft",
    issue_date: invoiceData.issue_date ?? new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("invoices").insert(invoice).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (items && items.length > 0) {
    const itemRows = items.map((item: { description: string; quantity: number; unit_price: number }) => ({
      invoice_id: data.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.quantity * item.unit_price,
    }));
    await supabase.from("invoice_items").insert(itemRows);
  }

  return NextResponse.json({ data }, { status: 201 });
}
