"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Filter, Search, Star } from "lucide-react";

export default function ResourcesPage() {
    const [category, setCategory] = useState<string>("");
    const [search, setSearch] = useState("");

    const resources = useQuery(api.resources.getResources, {
        category: category || undefined,
        featured: undefined
    });

    const categories = ["productivity", "mindset", "strategy", "technical", "article", "video", "template", "tool"];

    const filteredResources = resources?.filter(resource => 
        (category ? resource.category === category : true) &&
        (search ? resource.title.toLowerCase().includes(search.toLowerCase()) || 
                 resource.description?.toLowerCase().includes(search.toLowerCase()) ||
                 resource.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase())) : true)
    ) || [];

    return (
        <div className="min-h-screen bg-background">
            <main className="container max-w-2xl mx-auto py-10 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Resources</h1>
                    <p className="text-muted-foreground mb-6">
                        Templates, tools, and content to accelerate your progress.
                    </p>
                </div>

                {/* Category Filter */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                        <CardDescription>
                            Browse resources by category or use search.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border rounded-md"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search resources..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource) => (
                        <Card key={resource._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={
                                                resource.category === "productivity" ? "default" :
                                                resource.category === "mindset" ? "secondary" :
                                                resource.category === "strategy" ? "outline" :
                                                "destructive"
                                            }>
                                                {resource.category}
                                            </Badge>
                                            {resource.featured && (
                                                <Badge variant="secondary" className="ml-2">
                                                    <Star className="h-3 w-3" />
                                                    Featured
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    </div>
                                    {resource.url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(resource.url, '_blank')}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {resource.description}
                                </p>
                                
                                {resource.tags && resource.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {resource.tags.map((tag) => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {filteredResources.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <div className="text-muted-foreground">
                                <Filter className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-medium mb-2">No resources found</h3>
                                <p className="text-sm">
                                    {search 
                                        ? "No resources match your search criteria." 
                                        : category 
                                            ? `No resources found in the ${category} category.` 
                                            : "No resources available."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}