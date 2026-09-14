import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface RegistrationRequest {
  email: string;
  fullName: string;
  passkey: string;
  password: string;
}

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

function response(body: Record<string, string>, status: number): Response {
  return new Response(JSON.stringify(body), { headers: corsHeaders, status });
}

function hasRequiredFields(value: unknown): value is RegistrationRequest {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return ["email", "fullName", "passkey", "password"].every((key) => typeof record[key] === "string");
}

function secureEqual(left: string, right: string): boolean {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  let difference = leftBytes.length ^ rightBytes.length;
  const longestLength = Math.max(leftBytes.length, rightBytes.length);

  for (let index = 0; index < longestLength; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return difference === 0;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return response({ error: "Method not allowed." }, 405);

  const expectedPasskey = Deno.env.get("CATHMIN_ADMIN_REGISTRATION_PASSKEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!expectedPasskey || !supabaseUrl || !serviceRoleKey) return response({ error: "Registration is not configured." }, 500);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return response({ error: "Invalid request body." }, 400);
  }

  if (!hasRequiredFields(payload)) return response({ error: "Invalid registration details." }, 400);

  const email = payload.email.trim().toLowerCase();
  const fullName = payload.fullName.trim();
  if (!secureEqual(payload.passkey, expectedPasskey)) return response({ error: "Invalid registration passkey." }, 403);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || fullName.length < 2 || fullName.length > 100 || payload.password.length < 12) {
    return response({ error: "Invalid registration details." }, 400);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error } = await adminClient.auth.admin.createUser({
    email,
    email_confirm: true,
    password: payload.password,
    user_metadata: { full_name: fullName },
  });

  if (error) return response({ error: "Unable to create the account." }, 400);
  return response({ message: "Account created." }, 201);
});
