"use server";

import * as cheerio from "cheerio";

export async function fetchMetadata(targetUrl: string) {
    // Source: Google AI search lol
    try {
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; MetadataBot/1.0)",
            },
        });

        if (!response.ok) {
            throw new Error("Error: failed to fetch URL.");
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract title
        const title =
            $('meta[property="og:title"]').attr("content") ||
            $('meta[name="twitter:title"]').attr("content") ||
            $("title").text() ||
            "";

        // Extract description
        const description =
            $('meta[property="og:description"]').attr("content") ||
            $('meta[name="twitter:description"]').attr("content") ||
            $('meta[name="description"]').attr("content") ||
            "";

        // Extract icon
        let icon =
            $('link[rel="apple-touch-icon"]').attr("href") ||
            $('link[rel="icon"]').attr("href") ||
            $('link[rel="shortcut icon"]').attr("href") ||
            "/favicon.ico";

        // Assemble full icon URL
        if (icon) {
            icon = new URL(icon, targetUrl).href;
        }

        return {
            data: {
                title: title.trim(),
                description: description.trim(),
                iconUrl: icon,
            },
            error: null,
        };
    } catch (error) {
        let errorMessage = "An unknown error has occurred.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            data: null,
            error: errorMessage,
        };
    }
}
