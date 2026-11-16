"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetchMetadata } from "@/lib/queries/bookmark";
import { useState } from "react";

export default function AddBookmarkForm() {
    const [pageUrl, setPageUrl] = useState("");
    const [metadataError, setMetadataError] = useState<string | null>(null);
    const [metadataLoading, setMetadataLoading] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [iconUrl, setIconUrl] = useState<string>("");

    const handleMetadataError = (errorMessage: string) => {
        setMetadataError(errorMessage);

        setTimeout(() => {
            setMetadataError(null);
            setMetadataLoading(false);
        }, 3000);
    };

    const handleMetadata = async () => {
        setMetadataLoading(true);

        const { data: metadata, error: fetchError } =
            await fetchMetadata(pageUrl);

        if (fetchError) {
            handleMetadataError(fetchError);

            return;
        }

        if (!metadata) {
            handleMetadataError("Error: No metadata found.");

            return;
        }

        console.log(
            `Title: ${metadata.title}, Description: ${metadata.description}, Icon URL: ${metadata.iconUrl}`,
        );
        setTitle(metadata.title);
        setDescription(metadata.description);
        setIconUrl(metadata.iconUrl);
        setMetadataLoading(false);
    };

    return (
        <form className="mt-4 max-w-md">
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="page-url">
                        Page URL (the full URL)
                    </FieldLabel>
                    <Input
                        id="page-url"
                        type="text"
                        value={pageUrl}
                        placeholder="Enter page URL"
                        onChange={(e) => setPageUrl(e.target.value)}
                        required
                    />
                </Field>
                <Field>
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
                    {metadataError && (
                        <p className="form-error">{metadataError}</p>
                    )}
                    <FieldDescription>
                        Not everything will fill out automatically. You can
                        always fill in at least the title to add a bookmark.
                    </FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="title">
                        Page Title
                    </FieldLabel>
                    <Input
                        id="title"
                        name="title"
                        type="text"
                        value={title}
                        placeholder="Enter page title"
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="description">
                        Page Description
                    </FieldLabel>
                    <Textarea
                        id="description"
                        name="description"
                        value={description}
                        placeholder="Enter page description"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="icon-url">
                        Page Icon URL
                    </FieldLabel>
                    <Input
                        id="icon-url"
                        name="icon-url"
                        type="text"
                        value={iconUrl}
                        placeholder="Enter page icon URL"
                        onChange={(e) => setIconUrl(e.target.value)}
                    />
                </Field>
            </FieldGroup>
        </form>
    );
}
