import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowUpDown, Columns3, SunMoon } from "lucide-react";

export default function Features() {
    return (
        <section className="mx-auto max-w-5xl px-4 pb-16 md:pb-24">
            <div className="mb-10 text-center">
                <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
                    Features
                </h2>
                <p className="text-muted-foreground">
                    See what you&apos;re missing out on.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="feature-card">
                    <CardHeader>
                        <div className="feature-card-header">
                            <div className="filled-icon">
                                <SunMoon size={32} />
                            </div>
                            <span className="feature-card-title">
                                Dark/Light Modes
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        Easily toggle between light and dark modes at any time.
                    </CardContent>
                </Card>
                <Card className="feature-card">
                    <CardHeader>
                        <div className="feature-card-header">
                            <div className="filled-icon">
                                <ArrowUpDown size={32} />
                            </div>
                            <span className="feature-card-title">
                                Sorting/Filtering
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        Sort bookmarks by recently added, recently visited, or most visited.
                    </CardContent>
                </Card>
                <Card className="feature-card">
                    <CardHeader>
                        <div className="feature-card-header">
                            <div className="filled-icon">
                                <Columns3 size={32} />
                            </div>
                            <span className="feature-card-title">
                                Pagination
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        Bookmark the pages that have your favorite bookmarks!
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
