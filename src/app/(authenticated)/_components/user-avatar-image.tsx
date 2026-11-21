import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function UserAvatar({
    avatarFallback,
    avatarUrl,
}: {
    avatarFallback: string;
    avatarUrl: string | null;
}) {
    return (
        <Avatar>
            {avatarUrl && 
            <AvatarImage 
                src={avatarUrl} 
                fetchPriority="high"
            />
            }
            <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
    );
}
