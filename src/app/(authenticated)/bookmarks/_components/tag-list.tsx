import { getTags } from "@/lib/queries/tag";
import { Tag } from "@/types";
import { useEffect, useState } from "react";

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

    return (
        <>
            {loading && <p>Loading tags...</p>}
            {error && <p className="form-error">{error}</p>}
        </>
    );
}
