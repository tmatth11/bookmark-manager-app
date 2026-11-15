"use client";

import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AddBookmarkForm() {
    const [pageUrl, setPageUrl] = useState("");
    const [metadataError, setMetadataError] = useState<string | null>(null);
    const [metadataLoading, setMetadataLoading] = useState(false);

    const handleMetadata = () => {
        setMetadataLoading(true);
        
    };

    return (
        <form className="max-w-md mt-4">
            <FieldGroup>
                <FieldLabel htmlFor="page-url">Page URL</FieldLabel>
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
                    {metadataLoading ? "Loading Metadata..." : "Autofill Metadata"}
                </Button>
                {metadataError && <p className="form-error">{metadataError}</p>}
            </FieldGroup>
        </form>
    );
}
