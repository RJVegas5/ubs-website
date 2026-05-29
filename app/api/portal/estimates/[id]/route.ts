import { NextRequest, NextResponse } from "next/server";
import { getPortalCustomerFromRequest } from "@/lib/portal-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const customer = await getPortalCustomerFromRequest(req);
  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin()!;

  // Verify this estimate belongs to this customer
  const { data: estimate } = await supabase
    .from("estimates")
    .select("id, customer_id, status, total, estimate_number")
    .eq("id", id)
    .eq("customer_id", customer.id)
    .single();

  if (!estimate) {
    return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
  }

  if (estimate.status !== "sent") {
    return NextResponse.json(
      { error: "Only sent estimates can be approved or rejected" },
      { status: 400 }
    );
  }

  const { action } = await req.json();
  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const newStatus = action === "approve" ? "approved" : "rejected";

  const { error: updateError } = await supabase
    .from("estimates")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // If approved, auto-create a job
  if (newStatus === "approved") {
    await supabase.from("jobs").insert({
      customer_id: customer.id,
      estimate_id: id,
      title: `Job from Estimate ${estimate.estimate_number}`,
      service: "See estimate details",
      status: "scheduled",
      notes: `Created from customer portal approval of ${estimate.estimate_number}`,
    });

    // Create admin notification
    await supabase.from("notifications").insert({
      type: "estimate_approved",
      title: "Estimate Approved by Customer",
      body: `${customer.company_name || customer.contact_name} approved ${estimate.estimate_number} ($${Number(estimate.total).toLocaleString()}) via the customer portal.`,
      link: `/admin`,
    });
  }

  // Log activity
  await supabase.from("activities").insert({
    entity_type: "estimate",
    entity_id: id,
    action: newStatus,
    description: `Customer ${action}d estimate ${estimate.estimate_number} via portal`,
    created_by: customer.contact_name || "Customer Portal",
  });

  return NextResponse.json({ success: true, status: newStatus });
}
