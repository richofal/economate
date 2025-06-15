import React, { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    PageProps,
    SplitBill as SplitBillType,
    SplitBillItem,
    SplitBillParticipant,
} from "@/types";
import { Head, usePage, useForm, Link } from "@inertiajs/react";
import { Save, FileSignature } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { ItemsCard } from "./Partials/ItemsCard";
import { ParticipantsCard } from "./Partials/ParticipantsCard";

interface EditSplitBillPageProps extends PageProps {
    splitBill: SplitBillType & {
        items: SplitBillItem[];
        participants: SplitBillParticipant[];
    };
}

export default function SplitBillsEdit() {
    const { splitBill } = usePage<EditSplitBillPageProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        title: splitBill.title,
        items: splitBill.items.map((item) => ({
            name: item.name,
            price: String(item.price),
            quantity: item.quantity || 1,
        })),
        participants: splitBill.participants.map((p) => ({
            name: p.name,
            amount_owed: String(p.amount_owed),
        })),
    });

    const totalFromItems = useMemo(() => {
        return data.items.reduce(
            (sum, item) =>
                sum + (parseFloat(item.price) || 0) * (item.quantity || 1),
            0
        );
    }, [data.items]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSubmit = {
            ...data,
            total_amount: totalFromItems,
        };
        put(route("splitBills.update", splitBill.id));
    };

    return (
        <AuthenticatedLayout title="Edit Split Bill">
            <Head title={`Edit - ${splitBill.title}`} />
            <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href={route("splitBills.index")}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold flex items-center mb-4">
                            <FileSignature className="w-5 h-5 mr-2" />
                            Info Tagihan
                        </h2>
                        <div>
                            <Label htmlFor="title">Judul Tagihan</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                required
                            />
                            {errors.title && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.title}
                                </p>
                            )}
                        </div>
                    </div>

                    <ItemsCard
                        items={data.items}
                        onItemsChange={(items) => setData("items", items)}
                        errors={errors}
                    />

                    <ParticipantsCard
                        participants={data.participants}
                        onParticipantsChange={(participants) =>
                            setData("participants", participants)
                        }
                        totalBill={totalFromItems}
                        errors={errors}
                    />

                    <div className="flex justify-end gap-3">
                        <Link href={route("splitBills.show", splitBill.id)}>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" size="lg" disabled={processing}>
                            <Save className="w-4 h-4 mr-2" />{" "}
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
