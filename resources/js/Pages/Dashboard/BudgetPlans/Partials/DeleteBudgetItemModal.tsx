import React, { FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "@/Components/ui/button";
import { X, Loader, Trash2, AlertCircle } from "lucide-react";
import { BudgetItem } from "@/types";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    budgetItem: BudgetItem | null;
}

export function DeleteBudgetItemModal({
    isOpen,
    onClose,
    budgetItem,
}: DeleteModalProps) {
    const { delete: destroy, processing } = useForm();

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!budgetItem) return;
        destroy(route("budgetItems.destroy", budgetItem.id), {
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                        <AlertCircle
                                            className="h-6 w-6 text-red-600"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <Dialog.Title
                                        as="h3"
                                        className="mt-4 text-lg font-semibold leading-6 text-gray-900"
                                    >
                                        Hapus Item Anggaran
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">
                                            Apakah Anda yakin ingin menghapus
                                            item{" "}
                                            <span className="font-bold">
                                                "{budgetItem?.name}"
                                            </span>
                                            ?
                                        </p>
                                        <p className="mt-1 text-xs text-red-700">
                                            Tindakan ini tidak dapat dibatalkan.
                                        </p>
                                    </div>
                                </div>
                                <form
                                    onSubmit={submit}
                                    className="mt-6 flex justify-center gap-4"
                                >
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
                                        variant="destructive"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4 mr-2" />
                                        )}
                                        Ya, Hapus
                                    </Button>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
