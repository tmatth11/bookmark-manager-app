import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getTags } from "@/lib/queries/tag";
import { Tag } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function TagList() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleError = (errorMessage: string) => {
        setError(errorMessage);

        setTimeout(() => {
            setError(null);
            setLoading(false);
        }, 3000);
    };

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

    useEffect(() => {
        async function fetchTags() {
            setLoading(true);

            const { data: fetchedTags, error: tagsError } = await getTags();

            if (tagsError || !fetchedTags) {
                handleError(tagsError);

                return;
            }

            setTags(fetchedTags);
            setLoading(false);
        }

        fetchTags();
    }, []);

    const allTags = useMemo(() => {
        const selectedSet = new Set(selectedTagNames);
        const selected = tags.filter((tag) => selectedSet.has(tag.name));
        const unselected = tags.filter((tag) => !selectedSet.has(tag.name));

        return [...selected, ...unselected];
    }, [tags, selectedTagNames]);

    return (
        <>
            {loading && <p>Loading tags...</p>}
            {error && <p className="form-error">{error}</p>}
            <div className="flex flex-col items-start gap-2">
                {allTags.map((tag) => {
                    const isChecked = selectedTagNames.includes(tag.name);

                    return (
                        <div
                            className="flex w-full cursor-pointer justify-between gap-2"
                            key={tag.id}
                            onClick={() => handleToggleTag(tag.name)}
                        >
                            <div className="flex items-center gap-2">
                                <Checkbox checked={isChecked} />
                                <p className="min-w-0 break-all">{tag.name}</p>
                            </div>
                            <Badge variant="secondary">{tag.count}</Badge>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
