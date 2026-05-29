import { NextRequest, NextResponse } from "next/server";
import { getPortalCustomerFromRequest } from "@/lib/portal-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const customer = await getPortalCustomerFromRequest(req);
  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subject, message } = await req.json();
  if (!subject || !message) {
    return NextResponse.json(
      { error: "Subject and message required" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin()!;

  // Log the message as an activity on the customer record
  await supabase.from("activities").insert({
    entity_type: "customer",
    entity_id: customer.id,
    action: "portal_message",
    description: `[Portal Message] ${subject}: ${message}`,
    created_by: customer.contact_name || "Customer Portal",
  });

  // Create admin notification
  await supabase.from("notifications").insert({
    type: "system",
    title: "Portal Message Received",
    body: `${customer.company_name || customer.contact_name} sent a message: "${subject}"`,
    link: `/admin`,
  });

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const customer = await getPortalCustomerFromRequest(req);
  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin()!;

  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("entity_type", "customer")
    .eq("entity_id", customer.id)
    .eq("action", "portal_message")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data ?? [] });
}
