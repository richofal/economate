import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { PlusCircle, Trash2, Users } from "lucide-react";
import { formatCurrency, parseCurrency } from "@/lib/utils";

interface Participant {
    name: string;
    amount_owed: string;
}

interface ParticipantsCardProps {
    participants: Participant[];
    onParticipantsChange: (participants: Participant[]) => void;
    totalBill: number;
    errors: Partial<
        Record<
            | `participants.${number}.name`
            | `participants.${number}.amount_owed`,
            string
        >
    >;
}

export function ParticipantsCard({
    participants,
    onParticipantsChange,
    totalBill,
    errors,
}: ParticipantsCardProps) {
    const handleFieldChange = (
        index: number,
        field: keyof Participant,
        value: string
    ) => {
        const updatedParticipants = participants.map((p, i) =>
            i === index ? { ...p, [field]: value } : p
        );
        onParticipantsChange(updatedParticipants);
    };

    const addParticipant = () => {
        onParticipantsChange([...participants, { name: "", amount_owed: "0" }]);
    };

    const removeParticipant = (index: number) => {
        onParticipantsChange(participants.filter((_, i) => i !== index));
    };

    const distributeEvenly = () => {
        if (participants.length === 0 || totalBill <= 0) return;
        const amountPerPerson = totalBill / participants.length;
        onParticipantsChange(
            participants.map((p) => ({
                ...p,
                amount_owed: String(Math.round(amountPerPerson)),
            }))
        );
    };

    const totalOwed = participants.reduce(
        (sum, p) => sum + (parseFloat(p.amount_owed) || 0),
        0
    );

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-3">
                    <Users className="h-6 w-6 text-blue-500" />
                    Peserta
                </h2>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={distributeEvenly}
                    >
                        Bagi Rata
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addParticipant}
                    >
                        <PlusCircle className="w-4 h-4 mr-1" /> Tambah Peserta
                    </Button>
                </div>
            </div>
            <div className="p-6 space-y-3">
                {participants.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                        <p>Belum ada peserta. Silakan tambahkan.</p>
                    </div>
                ) : (
                    participants.map((p, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-12 gap-2 items-start"
                        >
                            <Input
                                placeholder="Nama Peserta"
                                value={p.name}
                                onChange={(e) =>
                                    handleFieldChange(
                                        index,
                                        "name",
                                        e.target.value
                                    )
                                }
                                className="col-span-6"
                            />
                            {errors[`participants.${index}.name`] && (
                                <p className="text-red-500 text-xs mt-1 col-span-12">
                                    {errors[`participants.${index}.name`]}
                                </p>
                            )}

                            <div className="relative col-span-5">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    Rp
                                </span>
                                <Input
                                    placeholder="Tagihan"
                                    value={formatCurrency(p.amount_owed)}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            index,
                                            "amount_owed",
                                            String(
                                                parseCurrency(e.target.value)
                                            )
                                        )
                                    }
                                    className="pl-9 text-right"
                                />
                                {errors[
                                    `participants.${index}.amount_owed`
                                ] && (
                                    <p className="text-red-500 text-xs mt-1 col-span-12">
                                        {
                                            errors[
                                                `participants.${index}.amount_owed`
                                            ]
                                        }
                                    </p>
                                )}
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeParticipant(index)}
                                className="col-span-1 text-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
            <div className="p-6 bg-gray-50 text-right font-semibold border-t flex justify-between items-center">
                <span>Total Tagihan: {formatCurrency(totalOwed)}</span>
                {Math.round(totalBill) !== Math.round(totalOwed) && (
                    <span className="text-red-500 text-xs font-normal">
                        Total tidak cocok dengan total item!
                    </span>
                )}
            </div>
        </div>
    );
}
