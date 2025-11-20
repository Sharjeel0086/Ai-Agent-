import { useState } from "react";

// Simple internet search using DuckDuckGo Instant Answer API
// For production, you might want to use a more robust search API
export async function searchInternet(query: string): Promise<string[]> {
  try {
    // Using DuckDuckGo HTML API (no API key needed)
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Search failed");
    }

    const data = await response.json();
    const results: string[] = [];

    if (data.AbstractText) {
      results.push(data.AbstractText);
    }

    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      data.RelatedTopics.slice(0, 3).forEach((topic: any) => {
        if (topic.Text) {
          results.push(topic.Text);
        }
      });
    }

    return results.length > 0 ? results : [`No specific results found for "${query}"`];
  } catch (error) {
    console.error("Internet search error:", error);
    return [`Search unavailable for "${query}"`];
  }
}

export function useInternetSearch() {
  const [isSearching, setIsSearching] = useState(false);

  const search = async (query: string): Promise<string[]> => {
    setIsSearching(true);
    try {
      return await searchInternet(query);
    } finally {
      setIsSearching(false);
    }
  };

  return { search, isSearching };
}

