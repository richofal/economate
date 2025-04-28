import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Search, X, Eye, ChevronDown, UserRound, Filter } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Lead, LeadCollection, PageProps } from "@/types";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Badge } from "@/Components/ui/badge";

interface LeadsPageProps extends PageProps {
    leads: Lead[];
    canViewLeads: boolean;
}

const LeadsIndex = () => {
    const { leads, canViewLeads } = usePage<LeadsPageProps>().props;
    const [searchTerm, setSearchTerm] = useState("");

    // Filter leads based on search term
    const filteredLeads = leads.filter((lead) => {
        const matchesSearch =
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.phone &&
                lead.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (lead.address &&
                lead.address.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesSearch;
    });

    // Format date function
    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Check for permission
    if (!canViewLeads) {
        return (
            <AuthenticatedLayout>
                <Head title="Unauthorized" />
                <div className="container mx-auto py-6">
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
                        <h3 className="text-lg font-medium">
                            Unauthorized Access
                        </h3>
                        <p>You don't have permission to view leads.</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Leads Management" />

            <div className="container mx-auto py-6 space-y-6">
                {/* Breadcrumb Navigation */}
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={route("dashboard")}>
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>Leads</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <Card className="">
                    <CardContent className="py-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold">
                                        Leads Management
                                    </h1>
                                    <p className="text-muted-foreground">
                                        View and manage potential customers
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 items-center">
                                <Badge
                                    variant="outline"
                                    className="px-3 py-1.5 bg-white shadow-sm"
                                >
                                    <UserRound className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                    <span className="font-medium">
                                        Total Leads:
                                    </span>
                                    <span className="ml-1 text-primary font-semibold">
                                        {leads.length}
                                    </span>
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div>
                                <CardTitle>All Leads</CardTitle>
                                <CardDescription>
                                    View all potential customers in your system.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search leads by name, email, phone or address..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1"
                                    onClick={() => setSearchTerm("")}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {filteredLeads.length > 0 ? (
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Address</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredLeads.map((lead) => (
                                            <TableRow key={lead.id}>
                                                <TableCell className="font-medium">
                                                    {lead.name}
                                                </TableCell>
                                                <TableCell>
                                                    {lead.email}
                                                </TableCell>
                                                <TableCell>
                                                    {lead.phone || "-"}
                                                </TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    {lead.address || "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(
                                                        lead.created_at
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={route(
                                                                "leads.show",
                                                                lead.id
                                                            )}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <div className="bg-slate-100 rounded-full p-3 mb-4">
                                    <Search className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="mb-1 text-lg font-semibold">
                                    No leads found
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {searchTerm
                                        ? "No leads match your search criteria. Try with different keywords."
                                        : "There are no leads in the system yet."}
                                </p>
                            </div>
                        )}
                    </CardContent>

                    {leads.length > 0 && (
                        <CardFooter className="border-t px-6 py-4">
                            <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
                                <div>
                                    Showing{" "}
                                    <strong>{filteredLeads.length}</strong> of{" "}
                                    <strong>{leads.length}</strong> leads
                                </div>
                                <div className="flex items-center gap-1">
                                    {searchTerm && (
                                        <>
                                            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100">
                                                Search: "{searchTerm}"
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSearchTerm("");
                                                }}
                                            >
                                                <X className="h-3 w-3 mr-1" />
                                                Clear
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
};

export default LeadsIndex;
