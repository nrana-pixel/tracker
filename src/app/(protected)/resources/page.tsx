import { getResources } from "@/actions/resources";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { formatDate } from "@/lib/utils";

export default async function ResourcesPage() {
    const resources = await getResources();

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Community Resources</h1>
                    <p className="text-zinc-400">Share and discover learning materials</p>
                </div>
                <Link href="/resources/new">
                    <Button>
                        <Icons.Add className="w-4 h-4 mr-2" />
                        Share Resource
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {resources.length === 0 ? (
                    <Card className="text-center py-12 border-dashed border-zinc-800 bg-transparent">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 rounded-full bg-zinc-900">
                                <Icons.Doc className="w-8 h-8 text-zinc-500" />
                            </div>
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No resources yet</h3>
                        <p className="text-zinc-500">Be the first to share a helpful resource!</p>
                    </Card>
                ) : (
                    resources.map((resource) => (
                        <Card key={resource.id} variant="glass" className="group hover:border-zinc-700 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/[0.05] text-zinc-300 border border-white/[0.05]">
                                                {resource.type}
                                            </span>
                                            {resource.topic && (
                                                <span className="flex items-center text-xs text-zinc-500">
                                                    <Icons.Topics className="w-3 h-3 mr-1" />
                                                    {resource.topic.name}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-semibold text-white group-hover:text-zinc-200 transition-colors">
                                            <a
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2"
                                            >
                                                {resource.title}
                                                <Icons.ArrowRight className="w-4 h-4 -rotate-45 text-zinc-500 group-hover:text-white transition-colors" />
                                            </a>
                                        </h3>

                                        {resource.description && (
                                            <p className="text-zinc-400 text-sm">{resource.description}</p>
                                        )}

                                        <div className="flex items-center gap-3 mt-4 text-xs text-zinc-500">
                                            <span className="flex items-center">
                                                By {resource.user.name}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center">
                                                {new Date(resource.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center min-w-[60px] border-l border-white/[0.05] pl-4">
                                        <Button variant="ghost" size="sm" className="h-auto p-2 hover:bg-white/[0.05] flex-col gap-1">
                                            <Icons.ArrowRight className="w-4 h-4 -rotate-90" />
                                            <span className="font-semibold text-white">{resource.upvotes}</span>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
