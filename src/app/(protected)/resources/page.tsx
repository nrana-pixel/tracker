import { getResources } from "@/actions/resources";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function ResourcesPage() {
    const resources = await getResources();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Community Resources</h1>
                    <p className="text-gray-400 mt-1">Share and discover learning materials</p>
                </div>
                <Link href="/resources/new">
                    <Button className="glow">
                        + Share Resource
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {resources.length === 0 ? (
                    <Card className="text-center py-12">
                        <p className="text-gray-400">No resources shared yet. Be the first!</p>
                    </Card>
                ) : (
                    resources.map((resource) => (
                        <Card key={resource.id} className="hover:border-indigo-500/50 transition-colors">
                            <CardContent className="flex flex-col md:flex-row gap-4 justify-between items-start pt-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-0.5 rounded border border-indigo-500/20">
                                            {resource.type}
                                        </span>
                                        {resource.topic && (
                                            <span className="text-gray-500 text-xs">
                                                • {resource.topic.name}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                            {resource.title} ↗
                                        </a>
                                    </h3>
                                    {resource.description && (
                                        <p className="text-gray-400 text-sm mt-1">{resource.description}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                                        <span>Shared by {resource.user.name}</span>
                                        <span>• {new Date(resource.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                                    <span className="text-2xl font-bold text-white/50">
                                        ^{resource.upvotes}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
