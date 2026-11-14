import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function UserAvatar({
    avatarFallback,
    avatarUrl
}: {
    avatarFallback: string;
    avatarUrl: string | null;
}) {
    return (
        <button type="button">
            <Avatar>
                {avatarUrl && <AvatarImage src={avatarUrl} />}
                <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
        </button>
    );
}
