import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function TagList({ bookmarkTags }: { bookmarkTags: Tag[] }) {
    const [tags, setTags] = useState<Tag[]>(bookmarkTags);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedTagNames = useMemo(() => {
        return searchParams.getAll("tag");
    }, [searchParams]);

    const handleToggleTag = (tagName: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentTags = params.getAll("tag");

        params.delete("tag");

        if (currentTags.includes(tagName)) {
            currentTags
                .filter((name) => name !== tagName)
                .forEach((name) => params.append("tag", name));
        } else {
            [...currentTags, tagName].forEach((name) =>
                params.append("tag", name),
            );
        }

        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    };

    const allTags = useMemo(() => {
        const selectedSet = new Set(selectedTagNames);
        const selected = bookmarkTags.filter((tag) =>
            selectedSet.has(tag.name),
        );
        const unselected = bookmarkTags.filter(
            (tag) => !selectedSet.has(tag.name),
        );

        return [...selected, ...unselected];
    }, [bookmarkTags, selectedTagNames]);

    return (
        <>
            {loading && <p>Loading tags...</p>}
            {error && <p className="form-error">{error}</p>}
            <div className="flex flex-col items-start gap-2">
                {allTags.length === 0 ? (
                    <p>There are no tags to display.</p>
                ) : (
                    allTags.map((tag) => {
                        const isChecked = selectedTagNames.includes(tag.name);

                        return (
                            <div
                                className="flex w-full cursor-pointer justify-between gap-2"
                                key={tag.id}
                                onClick={() => handleToggleTag(tag.name)}
                            >
                                <div className="flex items-center gap-2">
                                    <Checkbox checked={isChecked} />
                                    <p className="min-w-0 break-all">
                                        {tag.name}
                                    </p>
                                </div>
                                <Badge variant="secondary">{tag.count}</Badge>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}
