import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const body = await req.json();

  // If marking paid, recalculate balance_due
  let updates = { ...body, updated_at: new Date().toISOString() };
  if (body.amount_paid !== undefined || body.status === "paid") {
    // Fetch current invoice to calculate balance
    const { data: existing } = await supabase.from("invoices").select("total, amount_paid").eq("id", id).single();
    if (existing) {
      const amountPaid = body.amount_paid ?? existing.total;
      const balanceDue = existing.total - amountPaid;
      updates = {
        ...updates,
        amount_paid: amountPaid,
        balance_due: Math.max(0, balanceDue),
        status: balanceDue <= 0 ? "paid" : body.amount_paid > 0 ? "partial" : body.status ?? existing.amount_paid > 0 ? "partial" : "sent",
      };
    }
  }

  const { data, error } = await supabase
    .from("invoices")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify when paid
  if (data.status === "paid") {
    await supabase.from("notifications").insert({
      type: "invoice_paid",
      title: "Invoice Paid",
      body: `Invoice ${data.invoice_number} has been fully paid — $${data.total.toFixed(2)}`,
      link: `/admin?view=invoices`,
      read: false,
    });

    // Update customer lifetime value
    if (data.customer_id) {
      const { data: customer } = await supabase.from("customers").select("lifetime_value, outstanding_balance").eq("id", data.customer_id).single();
      if (customer) {
        await supabase.from("customers").update({
          lifetime_value: (customer.lifetime_value ?? 0) + data.total,
          outstanding_balance: Math.max(0, (customer.outstanding_balance ?? 0) - data.total),
        }).eq("id", data.customer_id);
      }
    }
  }

  return NextResponse.json({ data });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data, error } = await supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data });
}
