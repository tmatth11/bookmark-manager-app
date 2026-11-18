import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Bookmark } from "@/types";
import { Calendar, Clock, EllipsisVertical, Eye, Pin } from "lucide-react";
import Image from "next/image";
import BookmarkVisitLink from "./bookmark-visit-link";
import BookmarkArchiveLink from "./bookmark-archive-link";

export default function BookmarkCard({
    bookmark,
    currentPage,
}: {
    bookmark: Bookmark;
    currentPage: number;
}) {
    const createdAtDate = new Date(bookmark.createdAt);
    const formattedCreatedAtDate = createdAtDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
    });

    let formattedVisitedAtDate = "Never";
    if (bookmark.visitedAt !== null) {
        const visitedAtDate = new Date(bookmark.visitedAt);
        formattedVisitedAtDate = visitedAtDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
        });
    }

    return (
        <Card className="mx-auto flex aspect-square w-full max-w-[320px] flex-col gap-0 overflow-hidden p-0">
            <CardHeader className="flex h-[30%] shrink-0 items-center gap-2 px-4 py-2">
                <Image
                    src={bookmark.iconUrl}
                    width={50}
                    height={50}
                    alt="Bookmark image"
                    className="h-12.5 w-12.5 shrink-0 rounded-md border object-cover"
                    unoptimized
                />
                <BookmarkVisitLink bookmark={bookmark} />
                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline" />}>
                        <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>
                                Bookmark actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                            <BookmarkArchiveLink bookmark={bookmark} currentPage={currentPage} />
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <Separator className={"shrink-0"} />
            <CardContent className="h-[calc(55%-1px)] shrink-0 overflow-y-auto px-4 py-2">
                <p className="mb-2 text-xs">{bookmark.description}</p>
                <div className="flex w-full flex-wrap justify-start gap-2">
                    {bookmark.tags.map((tag) => (
                        <Badge
                            className="h-auto min-h-9 max-w-full min-w-0 py-1.5 text-left whitespace-normal"
                            key={tag.id}
                        >
                            <span className="min-w-0 break-all">
                                {tag.name}
                            </span>
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex h-[15%] shrink-0 items-center justify-between border-t px-4 py-2 text-xs">
                <div className="flex shrink-0 items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Eye size={16} />
                        <span>{bookmark.visits}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{formattedVisitedAtDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{formattedCreatedAtDate}</span>
                    </div>
                </div>
                <Toggle className={"shrink-0"} pressed={bookmark.isPinned}>
                    <Pin
                        size={16}
                        fill={bookmark.isPinned ? "white" : "none"}
                    />
                </Toggle>
            </CardFooter>
        </Card>
    );
}
