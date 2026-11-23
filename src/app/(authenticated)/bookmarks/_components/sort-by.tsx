"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortBy() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const sort = searchParams.get("sort-by") ?? "recently-added";

    const items = [
        { label: "Recently added", value: "recently-added" },
        { label: "Recently visited", value: "recently-visited" },
        { label: "Most visited", value: "most-visited" },
    ];

    const handleSort = (sortValue: string | null) => {
        if (!sortValue) return;

        const params = new URLSearchParams(searchParams);
        if (sortValue !== "recently-added") {
            params.set("sort-by", sortValue);
        } else {
            params.delete("sort-by");
        }

        const query = params.toString();
        replace(query ? `${pathname}?${query}` : pathname);
    };

    return (
        <Select items={items} value={sort} onValueChange={handleSort}>
            <SelectTrigger aria-label="Sort by">
                <div className="flex items-center gap-2">
                    <ArrowUpDown aria-hidden="true" />
                    <span>Sort by</span>
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Sort by</SelectLabel>
                    {items.map((item) => (
                        <SelectItem
                            className={"cursor-pointer"}
                            key={item.value}
                            value={item.value}
                        >
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
