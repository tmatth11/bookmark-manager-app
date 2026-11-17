"use server";

import { createClient } from "@/services/supabase/server";
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

const ITEMS_PER_PAGE = 10;

export async function getBookmarksPages(
    isArchived: boolean,
    query: string,
    tags: string[],
) {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return {
            data: null,
            errorMessage: "Error: No user has been found.",
        };
    }

    const selectClause =
        tags.length > 0 ? "id, bookmark_tag!inner(tag!inner(name))" : "*";

    let bookmarkPagesQuery = supabase
        .from("bookmark")
        .select(selectClause, { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_archived", isArchived);

    if (tags.length > 0) {
        bookmarkPagesQuery = bookmarkPagesQuery.in(
            "bookmark_tag.tag.name",
            tags,
        );
    }

    if (query !== "") {
        bookmarkPagesQuery = bookmarkPagesQuery.ilike("title", `%${query}%`);
    }

    const { count: bookmarkCount, error: countError } =
        await bookmarkPagesQuery;

    if (countError || bookmarkCount === null) {
        return {
            data: null,
            errorMessage: "Error: Unable to count bookmark pages.",
        };
    }

    return {
        data: Math.ceil(bookmarkCount / ITEMS_PER_PAGE),
        errorMessage: null,
    };
}

export async function getBookmarks(
    isArchived: boolean,
    sortBy: string,
    query: string,
    currentPage: number,
    tags: string[],
) {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return {
            data: null,
            errorMessage: "Error: No user has been found.",
        };
    }

    const page = Math.max(1, currentPage || 1);
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    let bookmarksQuery =
        tags.length > 0
            ? supabase
                .from("bookmark")
                .select(
                    `
                      id,
                      created_at,
                      page_url,
                      title,
                      description,
                      icon_url,
                      visited_at,
                      visits,
                      is_pinned,
                      all_tags:bookmark_tag(tag(id, name)),
                      filter_tags:bookmark_tag!inner(tag!inner(name))
                  `,
                )
                .in("filter_tags.tag.name", tags)
            : supabase.from("bookmark").select(
                `
                  id,
                  created_at,
                  page_url,
                  title,
                  description,
                  icon_url,
                  visited_at,
                  visits,
                  is_pinned,
                  all_tags:bookmark_tag(tag(id, name))
              `,
            );

    bookmarksQuery = bookmarksQuery
        .eq("user_id", user.id)
        .eq("is_archived", isArchived);

    if (query !== "") {
        bookmarksQuery = bookmarksQuery.ilike("title", `%${query}%`);
    }

    bookmarksQuery = bookmarksQuery.order("is_pinned", {
        ascending: false,
    });

    switch (sortBy) {
    case "recently-visited":
        bookmarksQuery = bookmarksQuery.order("visited_at", {
            ascending: false,
            nullsFirst: false,
        });
        break;
    case "most-visited":
        bookmarksQuery = bookmarksQuery.order("visits", {
            ascending: false,
        });
        break;
    case "recently-added":
    default:
        bookmarksQuery = bookmarksQuery.order("created_at", {
            ascending: false,
        });
        break;
    }

    bookmarksQuery = bookmarksQuery.order("id", {
        ascending: false,
    });

    const { data: bookmarks, error: bookmarksError } =
        await bookmarksQuery.range(from, to);

    if (bookmarksError || !bookmarks) {
        return {
            data: null,
            errorMessage: "Error: Unable to select bookmarks.",
        };
    }

    const formattedBookmarks = bookmarks.map((bookmark) => ({
        id: bookmark.id,
        createdAt: bookmark.created_at,
        pageUrl: bookmark.page_url,
        title: bookmark.title,
        description: bookmark.description,
        iconUrl: bookmark.icon_url,
        visitedAt: bookmark.visited_at,
        visits: bookmark.visits,
        isPinned: bookmark.is_pinned,
        tags: bookmark.all_tags
            .map((bt) => bt.tag)
            .filter((tag): tag is { id: string; name: string } => tag !== null),
    }));

    return {
        data: formattedBookmarks,
        errorMessage: null,
    };
}
