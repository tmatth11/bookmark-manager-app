import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
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

export default function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
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
        <Card className="h-64 w-64 md:h-58 md:w-58">
            <CardHeader className="flex items-center gap-2">
                <Image
                    src={bookmark.iconUrl}
                    width={50}
                    height={50}
                    alt="Bookmark image"
                    className="h-12.5 w-12.5 rounded-md border object-cover"
                    unoptimized
                />
                <div className="flex flex-col break-all">
                    <CardTitle>{bookmark.title}</CardTitle>
                    <CardDescription>{bookmark.pageUrl}</CardDescription>
                </div>
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
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <Separator />
            <CardContent className="overflow-y-auto">
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
            <CardFooter className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
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
                <Toggle pressed={bookmark.isPinned}>
                    <Pin fill={bookmark.isPinned ? "white" : "none"} />
                </Toggle>
            </CardFooter>
        </Card>
    );
}
