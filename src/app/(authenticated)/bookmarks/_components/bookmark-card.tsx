import { Card, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bookmark } from "@/types";
import Image from "next/image";

export default function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
    return (
        <Card className="h-64 w-64 md:w-58 md:h-58">
            <CardHeader className="flex items-center gap-2">
                <Image
                    src={bookmark.iconUrl}
                    width={50}
                    height={50}
                    alt="Bookmark image"
                    className="w-12.5 h-12.5 object-cover border rounded-md"
                    unoptimized
                />
            </CardHeader>
            <Separator />
        </Card>
    );
}
