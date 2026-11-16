"use client";

import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { fetchMetadata } from "@/lib/queries/bookmark";
import { useState } from "react";

export default function AddBookmarkForm() {
    const [pageUrl, setPageUrl] = useState("");
    const [metadataError, setMetadataError] = useState<string | null>(null);
    const [metadataLoading, setMetadataLoading] = useState(false);

    const handleMetadataError = (errorMessage: string) => {
        setMetadataError(errorMessage);

        setTimeout(() => {
            setMetadataError(null);
            setMetadataLoading(false);
        }, 3000);
    }

    const handleMetadata = async () => {
        setMetadataLoading(true);

        const { data: metadata, error: fetchError } = await fetchMetadata(pageUrl);

        if (fetchError) {
            handleMetadataError(fetchError);
            
            return;
        }

        if (!metadata) {
            handleMetadataError("Error: No metadata found.");

            return;
        }

        console.log(`Title: ${metadata.title}, Description: ${metadata.description}, Icon URL: ${metadata.iconUrl}`)
        setMetadataLoading(false);
    };

    return (
        <form className="mt-4 max-w-md">
            <FieldGroup>
                <FieldLabel htmlFor="page-url">Page URL (the full URL)</FieldLabel>
                <Input
                    id="page-url"
                    type="text"
                    value={pageUrl}
                    placeholder="Enter page URL"
                    onChange={(e) => setPageUrl(e.target.value)}
                    required
                />
                <Button
                    type="button"
                    variant="outline"
                    disabled={metadataLoading || pageUrl === ""}
                    onClick={handleMetadata}
                >
                    {metadataLoading
                        ? "Loading Metadata..."
                        : "Autofill Metadata"}
                </Button>
                {metadataError && <p className="form-error">{metadataError}</p>}
            </FieldGroup>
        </form>
    );
}
