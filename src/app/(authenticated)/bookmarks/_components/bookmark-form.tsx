"use client";

import { addBookmark, editBookmark } from "@/actions/bookmark-actions";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fetchMetadata } from "@/lib/queries/bookmark";
import { FetchedBookmark } from "@/types";
import { X } from "lucide-react";
import React, { useActionState } from "react";
import { useState } from "react";

export default function BookmarkForm({
    bookmark,
}: {
    bookmark?: FetchedBookmark;
}) {
    const [pageUrl, setPageUrl] = useState<string>(bookmark?.pageUrl ?? "");
    const [metadataError, setMetadataError] = useState<string | null>(null);
    const [metadataLoading, setMetadataLoading] = useState(false);
    const [title, setTitle] = useState<string>(bookmark?.title ?? "");
    const [description, setDescription] = useState<string>(
        bookmark?.description ?? "",
    );
    const [newTag, setNewTag] = useState<string>("");
    const [tags, setTags] = useState<Set<string>>(
        () => new Set(bookmark?.tags.map((tag) => tag.name) ?? []),
    );

    const isEditMode = Boolean(bookmark);
    const actionToUse = isEditMode ? editBookmark : addBookmark;

    const [state, formAction, isPending] = useActionState(actionToUse, null);

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
            handleMetadataError("Warning: No metadata found.");

            return;
        }

        setTitle(metadata.title);
        setDescription(metadata.description);
        setMetadataLoading(false);
    };

    const handleEnterMetadata = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleMetadata();
        }
    };

    const handleNewTag = () => {
        const formattedTag = newTag.trim().toLowerCase();

        if (!formattedTag) {
            setNewTag("");

            return;
        }

        setTags((prev) => new Set(prev).add(formattedTag));
        setNewTag("");
    };

    const handleEnterTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleNewTag();
        }
    };

    const handleRemoveTag = (updatedTags: string[]) => {
        setTags(new Set(updatedTags));
    };

    const tagsArray = Array.from(tags);

    return (
        <form action={formAction} className="mt-4 w-full max-w-md">
            {state?.errorMessage && (
                <p className="form-error mb-2">{state.errorMessage}</p>
            )}
            {bookmark && (
                <Input type="hidden" name="bookmark-id" value={bookmark.id} />
            )}
            {bookmark && (
                <Input type="hidden" name="user-id" value={bookmark.userId} />
            )}
            {state?.errors?.id?.[0] && (
                <p className="form-error mb-2">{state.errors.id[0]}</p>
            )}
            {state?.errors?.userId?.[0] && (
                <p className="form-error mb-2">{state.errors.userId[0]}</p>
            )}
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="page-url">
                        <span className="text-destructive" aria-hidden="true">
                            *
                        </span>
                        Page URL (the full URL)
                    </FieldLabel>
                    <Input
                        id="page-url"
                        name="page-url"
                        type="text"
                        value={pageUrl}
                        placeholder="Enter page URL"
                        onChange={(e) => setPageUrl(e.target.value)}
                        onKeyDown={handleEnterMetadata}
                        required
                    />
                    {state?.errors?.pageUrl?.[0] && (
                        <p className="form-error">{state.errors.pageUrl[0]}</p>
                    )}
                </Field>
                <Field>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={
                            metadataLoading || pageUrl === "" || isPending
                        }
                        onClick={handleMetadata}
                    >
                        {metadataLoading
                            ? "Loading Metadata..."
                            : "Autofill Metadata"}
                    </Button>
                    {metadataError && (
                        <p className="form-error">{metadataError}</p>
                    )}
                    <FieldDescription className="text-accent-foreground">
                        Not everything will fill out automatically. You can
                        always fill in at least the title to add a bookmark.
                    </FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="title">
                        <span className="text-destructive" aria-hidden="true">
                            *
                        </span>
                        Page title
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
                    {state?.errors?.title?.[0] && (
                        <p className="form-error">{state.errors.title[0]}</p>
                    )}
                </Field>
                <Field>
                    <FieldLabel htmlFor="description">
                        Page description
                    </FieldLabel>
                    <Textarea
                        id="description"
                        name="description"
                        value={description}
                        placeholder="Enter page description"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <FieldDescription className="text-accent-foreground">
                        Page description is optional.
                    </FieldDescription>
                    {state?.errors?.description?.[0] && (
                        <p className="form-error">
                            {state.errors.description[0]}
                        </p>
                    )}
                </Field>
                <Field>
                    <FieldLabel htmlFor="new-tag">New tag</FieldLabel>
                    <Input
                        id="new-tag"
                        name="new-tag"
                        type="text"
                        value={newTag}
                        placeholder="Enter new tag"
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={handleEnterTag}
                    />
                    <FieldDescription className="text-accent-foreground">
                        Tags are optional.
                    </FieldDescription>
                    {state?.errors?.tags?.[0] && (
                        <p className="form-error">{state.errors.tags[0]}</p>
                    )}
                </Field>
                <Field>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={newTag === "" || isPending}
                        onClick={handleNewTag}
                    >
                        Add new tag
                    </Button>
                    <ScrollArea
                        className={"bg-card mt-2 h-70 rounded-md border p-2"}
                    >
                        <p className="mb-4 text-sm font-bold">Tags</p>
                        {tags.size === 0 ? (
                            <p className="text-sm">No tags added yet.</p>
                        ) : (
                            <ToggleGroup
                                className="flex w-full flex-wrap justify-start gap-2"
                                multiple
                                value={tagsArray}
                                onValueChange={handleRemoveTag}
                            >
                                {tagsArray.map((tag) => (
                                    <ToggleGroupItem
                                        key={tag}
                                        value={tag}
                                        aria-label={`Remove ${tag} tag`}
                                        className="h-auto min-h-9 max-w-full min-w-0 gap-1.5 py-1.5 text-left whitespace-normal"
                                        title="Remove tag"
                                    >
                                        <Input
                                            type="hidden"
                                            name="tags"
                                            value={tag}
                                        />
                                        <span className="min-w-0 break-all">
                                            {tag}
                                        </span>
                                        <X className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        )}
                    </ScrollArea>
                </Field>
                <Field>
                    <Button
                        type="submit"
                        disabled={
                            pageUrl === "" ||
                            title === "" ||
                            metadataLoading ||
                            isPending
                        }
                    >
                        Submit
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}
