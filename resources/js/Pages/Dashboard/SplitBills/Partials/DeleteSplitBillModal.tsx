import React, { FormEvent, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "@/Components/ui/button";
import { X, Trash2, Loader, AlertCircle } from "lucide-react";
import { SplitBill } from "@/types";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    bill: SplitBill | null;
}

export function DeleteSplitBillModal({
    isOpen,
    onClose,
    bill,
}: DeleteModalProps) {
    const { delete: destroy, processing } = useForm();

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!bill) return;
        destroy(route("splitBills.destroy", bill.id), {
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
                                    as="div"
                                    className="flex items-center justify-between p-6 pb-4 border-b"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                        Konfirmasi Hapus
                                    </h3>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={20} />
                                    </button>
                                </Dialog.Title>

                                <form onSubmit={submit} className="p-6">
                                    <p className="text-sm text-gray-600">
                                        Apakah Anda yakin ingin menghapus
                                        tagihan{" "}
                                        <span className="font-bold">
                                            "{bill?.title}"
                                        </span>
                                        ?
                                    </p>
                                    <p className="mt-2 text-xs text-red-700 bg-red-50 p-3 rounded-md">
                                        Peringatan: Tindakan ini tidak dapat
                                        dibatalkan. Semua data item dan peserta
                                        yang terkait dengan tagihan ini akan
                                        dihapus secara permanen.
                                    </p>
                                    <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
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
