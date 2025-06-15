// resources/js/Pages/BudgetPlans/Partials/CreateBudgetItemModal.tsx

import { FormEvent, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Loader, Save } from "lucide-react";

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    budgetPlanId: number;
}

export function CreateBudgetItemModal({
    isOpen,
    onClose,
    budgetPlanId,
}: CreateModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        amount: "",
        description: "",
        status: "planned",
    });

    useEffect(() => {
        if (isOpen) reset();
    }, [isOpen]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route("budgetPlans.budgetItems.store", budgetPlanId), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-60" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 p-6 border-b"
                                >
                                    Tambah Item Anggaran
                                </Dialog.Title>
                                <form
                                    onSubmit={submit}
                                    className="p-6 space-y-4"
                                >
                                    <div>
                                        <Label htmlFor="name">Nama Item</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="amount">
                                            Jumlah Anggaran
                                        </Label>
                                        <div className="relative mt-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">
                                                    Rp
                                                </span>
                                            </div>
                                            <Input
                                                id="amount"
                                                type="number"
                                                value={data.amount}
                                                onChange={(e) =>
                                                    setData(
                                                        "amount",
                                                        e.target.value
                                                    )
                                                }
                                                className="pl-9"
                                                placeholder="0"
                                                required
                                            />
                                        </div>
                                        {errors.amount && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.amount}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="description">
                                            Deskripsi (Opsional)
                                        </Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={onClose}
                                            disabled={processing}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4 mr-2" />
                                            )}
                                            Simpan
                                        </Button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
