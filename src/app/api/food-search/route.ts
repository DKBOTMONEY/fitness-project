import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ products: [] });
  }

  console.log(`[Food Search Proxy] Searching for: "${query}"`);

  try {
    // Detect if the query contains Thai characters
    const isThai = /[\u0E00-\u0E7F]/.test(query);
    const primaryDomain = isThai ? "th" : "world";
    
    // We will try multiple strategies to get the data
    const strategies = [
      // Strategy 1: Legacy search on the specific domain (most likely to have Thai products)
      `https://${primaryDomain}.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10&fields=product_name,generic_name,brands,nutriments,image_small_url,image_url`,
      
      // Strategy 2: V2 Search API on world domain (modern, often more stable)
      `https://world.openfoodfacts.org/api/v2/search?q=${encodeURIComponent(query)}&page_size=10&fields=product_name,generic_name,brands,nutriments,image_small_url,image_url`,
      
      // Strategy 3: Fallback to world domain legacy search
      isThai ? `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10&fields=product_name,generic_name,brands,nutriments,image_small_url,image_url` : null,
    ].filter(Boolean) as string[];

    let lastError = null;
    
    for (const searchUrl of strategies) {
      console.log(`[Food Search Proxy] Trying strategy: ${searchUrl}`);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s per attempt

        const response = await fetch(searchUrl, {
          headers: {
            // Polite User-Agent with a descriptive name and version
            "User-Agent": "HundeeApp - Web - Version 1.1 - https://github.com/hundee",
            "Accept": "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data.products && data.products.length > 0) {
            console.log(`[Food Search Proxy] Success with: ${searchUrl}. Found ${data.products.length} products.`);
            return NextResponse.json(data);
          }
          console.log(`[Food Search Proxy] Strategy returned no products: ${searchUrl}`);
        } else {
          console.warn(`[Food Search Proxy] Strategy failed with status ${response.status}: ${searchUrl}`);
          if (response.status === 503) {
            lastError = "Service overloaded (503). Trying next strategy...";
            continue;
          }
        }
      } catch (err: any) {
        console.warn(`[Food Search Proxy] Strategy error: ${err.message}`);
        lastError = err.message;
      }
    }

    return NextResponse.json(
      { error: lastError || "Food database is temporarily busy. Please try again in a moment." },
      { status: 503 }
    );
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("[Food Search Proxy] Request timed out");
      return NextResponse.json({ error: "Request timed out" }, { status: 504 });
    }
    console.error("[Food Search Proxy] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error during search" },
      { status: 500 }
    );
  }
}
