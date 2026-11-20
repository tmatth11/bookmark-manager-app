import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function Tesimonials() {
    const testimonials = [
        {
            name: "G-Man",
            initials: "GM",
            role: "Research Associate",
            avatarSrc: "/g-man.webp",
            stars: 5,
            quote: "This will be very useful for my employers...",
        },
        {
            name: "Dr. Isaac Kleiner",
            initials: "IK",
            role: "Anomalaus Materials Scientist",
            avatarSrc: "/dr-kleiner.webp",
            stars: 5,
            quote: "What a great place to organize all my research!",
        },
        {
            name: "Gordon Freeman",
            initials: "GF",
            role: "Research Associate",
            avatarSrc: "/gordon-freeman.webp",
            stars: 5,
            quote: "...",
        },
    ];

    return (
        <section className="mx-auto max-w-5xl px-4 pb-16 md:pb-24">
            <div className="mb-10 text-center">
                <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
                    Testimonials
                </h2>
                <p className="text-muted-foreground">
                    Read what other people are saying about it.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {testimonials.map((testimonial) => (
                    <Card key={testimonial.name} className="h-full">
                        <CardHeader>
                            <div className="mb-2 flex items-center gap-1">
                                {Array.from({ length: testimonial.stars }).map(
                                    (_, index) => (
                                        <Star
                                            key={index}
                                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                        />
                                    ),
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage
                                        src={testimonial.avatarSrc}
                                        alt={`${testimonial.name}'s avatar`}
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                &quot;{testimonial.quote}&quot;
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
