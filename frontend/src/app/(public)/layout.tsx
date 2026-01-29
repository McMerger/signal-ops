import { PublicNav } from "@/components/layout/public-nav";
import { SceneBackground } from "@/components/canvas/scene-background";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background relative flex flex-col">
            <PublicNav />
            <main className="flex-1 pt-16">
                {children}
            </main>
        </div>
    );
}
