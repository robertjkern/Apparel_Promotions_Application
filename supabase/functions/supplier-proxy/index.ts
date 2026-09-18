import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SupplierRequest {
  supplier: "sanmar" | "onestop";
  action: "search" | "product" | "inventory";
  query?: string;
  sku?: string;
  category?: string;
  page?: number;
  limit?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: SupplierRequest = await req.json();
    const { supplier, action } = body;

    const sanmarKey = Deno.env.get("SANMAR_API_KEY");
    const onestopKey = Deno.env.get("ONESTOP_API_KEY");

    if (supplier === "sanmar" && !sanmarKey) {
      return new Response(JSON.stringify({
        error: "SanMar API key not configured. Please contact support to enable supplier integration.",
        supplier: "sanmar",
      }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (supplier === "onestop" && !onestopKey) {
      return new Response(JSON.stringify({
        error: "OneStop API key not configured. Please contact support to enable supplier integration.",
        supplier: "onestop",
      }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let result: Record<string, unknown> = {};

    if (supplier === "sanmar") {
      const baseUrl = "https://api.sanmar.com/v1";
      const headers: Record<string, string> = {
        "Authorization": `Bearer ${sanmarKey}`,
        "Content-Type": "application/json",
      };

      if (action === "search") {
        const params = new URLSearchParams();
        if (body.query) params.set("search", body.query);
        if (body.category) params.set("category", body.category);
        params.set("page", String(body.page ?? 1));
        params.set("limit", String(body.limit ?? 20));

        const resp = await fetch(`${baseUrl}/products?${params}`, { headers });
        if (!resp.ok) throw new Error(`SanMar API error: ${resp.status}`);
        result = await resp.json();
      } else if (action === "product" && body.sku) {
        const resp = await fetch(`${baseUrl}/products/${body.sku}`, { headers });
        if (!resp.ok) throw new Error(`SanMar API error: ${resp.status}`);
        result = await resp.json();
      } else if (action === "inventory" && body.sku) {
        const resp = await fetch(`${baseUrl}/inventory/${body.sku}`, { headers });
        if (!resp.ok) throw new Error(`SanMar API error: ${resp.status}`);
        result = await resp.json();
      }
    } else if (supplier === "onestop") {
      const baseUrl = "https://api.onestopinc.com/v1";
      const headers: Record<string, string> = {
        "Authorization": `Bearer ${onestopKey}`,
        "Content-Type": "application/json",
      };

      if (action === "search") {
        const params = new URLSearchParams();
        if (body.query) params.set("search", body.query);
        if (body.category) params.set("category", body.category);
        params.set("page", String(body.page ?? 1));
        params.set("limit", String(body.limit ?? 20));

        const resp = await fetch(`${baseUrl}/products?${params}`, { headers });
        if (!resp.ok) throw new Error(`OneStop API error: ${resp.status}`);
        result = await resp.json();
      } else if (action === "product" && body.sku) {
        const resp = await fetch(`${baseUrl}/products/${body.sku}`, { headers });
        if (!resp.ok) throw new Error(`OneStop API error: ${resp.status}`);
        result = await resp.json();
      } else if (action === "inventory" && body.sku) {
        const resp = await fetch(`${baseUrl}/inventory/${body.sku}`, { headers });
        if (!resp.ok) throw new Error(`OneStop API error: ${resp.status}`);
        result = await resp.json();
      }
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
