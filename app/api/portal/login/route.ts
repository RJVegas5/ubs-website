import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { signToken, PORTAL_COOKIE } from "@/lib/portal-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Service not configured" },
        { status: 503 }
      );
    }

    // Look up customer by portal email
    const { data: customer, error } = await supabase
      .from("customers")
      .select(
        "id, company_name, contact_name, portal_email, portal_password_hash, is_active"
      )
      .eq("portal_email", email.toLowerCase().trim())
      .single();

    if (error || !customer) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!customer.is_active) {
      return NextResponse.json(
        { error: "This account has been deactivated. Please contact UBS." },
        { status: 403 }
      );
    }

    if (!customer.portal_password_hash) {
      return NextResponse.json(
        {
          error:
            "Portal access not set up for this account. Please contact UBS.",
        },
        { status: 401 }
      );
    }

    // Compare password (plain text for MVP — admin sets this in the CRM)
    // Production upgrade: replace with bcrypt.compare(password, customer.portal_password_hash)
    if (customer.portal_password_hash !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken(customer.id);

    const res = NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.contact_name,
        company: customer.company_name,
      },
    });

    res.cookies.set(PORTAL_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
