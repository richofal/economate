import { FormEvent, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { X, Loader, Save } from "lucide-react";
import { BudgetItem } from "@/types";

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    budgetItem: BudgetItem | null;
}

export function EditBudgetItemModal({
    isOpen,
    onClose,
    budgetItem,
}: EditModalProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: "",
        amount: "",
        description: "",
        status: "planned",
    });

    useEffect(() => {
        if (isOpen && budgetItem) {
            setData({
                name: budgetItem.name,
                amount: budgetItem.amount,
                description: budgetItem.description || "",
                status: budgetItem.status,
            });
        }
    }, [isOpen, budgetItem]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!budgetItem) return;
        put(route("budgetItems.update", budgetItem.id), {
            onSuccess: () => onClose(),
            preserveScroll: true,
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
                                    Edit Item Anggaran
                                </Dialog.Title>
                                <form
                                    onSubmit={submit}
                                    className="p-6 space-y-4"
                                >
                                    <div>
                                        <Label htmlFor="edit-name">
                                            Nama Item
                                        </Label>
                                        <Input
                                            id="edit-name"
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
                                        <Label htmlFor="edit-amount">
                                            Jumlah Anggaran
                                        </Label>
                                        <div className="relative mt-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 sm:text-sm">
                                                Rp
                                            </span>
                                            <Input
                                                id="edit-amount"
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
                                        <Label htmlFor="edit-description">
                                            Deskripsi (Opsional)
                                        </Label>
                                        <textarea
                                            id="edit-description"
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
                                    <div>
                                        <Label
                                            htmlFor="edit-status"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Status
                                        </Label>
                                        <select
                                            id="edit-status"
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="planned">
                                                Direncanakan
                                            </option>
                                            <option value="in_progress">
                                                Sedang Berjalan
                                            </option>
                                            <option value="completed">
                                                Selesai
                                            </option>
                                        </select>
                                        {errors.status && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.status}
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
                                            Simpan Perubahan
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
