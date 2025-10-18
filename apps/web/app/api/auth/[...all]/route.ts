
import { getAuth } from "@/lib/auth";

// Initialize handlers at module level

export async function GET(req: Request) {
  const auth = await getAuth();
  
  return auth.handler(req);
}

export async function POST(req: Request) {

  const auth = await getAuth();
  return auth.handler(req);
}