import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getTags } from "@/lib/queries/tag";
import { Tag } from "@/types";
import { useEffect, useMemo, useState } from "react";

export default function TagList() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleError = (errorMessage: string) => {
        setError(errorMessage);

        setTimeout(() => {
            setError(null);
            setLoading(false);
        }, 3000);
    };

    const handleToggleTag = () => {};

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
        const selectedIds = new Set(selectedTags.map((tag) => tag.id));
        return [
            ...selectedTags,
            ...tags.filter((tag) => !selectedIds.has(tag.id)),
        ];
    }, [tags, selectedTags]);

    return (
        <>
            {loading && <p>Loading tags...</p>}
            {error && <p className="form-error">{error}</p>}
            <div className="flex flex-col items-start gap-2">
                {allTags.map((tag) => (
                    <div
                        className="flex w-full justify-between gap-2"
                        key={tag.id}
                    >
                        <div className="flex items-center gap-2">
                            <Checkbox />
                            <p className="min-w-0 break-all">
                                {tag.name}
                            </p>
                        </div>
                        <Badge variant="secondary">{tag.count}</Badge>
                    </div>
                ))}
            </div>
        </>
    );
}
