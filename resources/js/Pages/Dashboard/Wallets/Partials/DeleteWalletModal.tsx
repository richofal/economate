import { router } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Wallet } from "@/types";
import { Trash2 } from "lucide-react";

interface DeleteWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    wallet: Wallet | null;
}

export const DeleteWalletModal = ({
    isOpen,
    onClose,
    wallet,
}: DeleteWalletModalProps) => {
    const [processing, setProcessing] = useState(false);

    const deleteWallet = () => {
        if (!wallet) return;
        setProcessing(true);
        router.delete(route("wallets.destroy", wallet.id), {
            onSuccess: () => {
                onClose();
                setProcessing(false);
            },
            onError: () => setProcessing(false),
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
                                        <Trash2
                                            className="h-6 w-6 text-red-600"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <Dialog.Title
                                        as="h3"
                                        className="mt-4 text-lg font-semibold leading-6 text-gray-900"
                                    >
                                        Hapus Dompet
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">
                                            Apakah Anda yakin ingin menghapus
                                            dompet{" "}
                                            <span className="font-bold">
                                                "{wallet?.name}"
                                            </span>
                                            ?
                                        </p>
                                        <p className="text-sm text-red-600 mt-2">
                                            Tindakan ini tidak dapat dibatalkan.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-center gap-4">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50"
                                        onClick={onClose}
                                        disabled={processing}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                        onClick={deleteWallet}
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Menghapus..."
                                            : "Ya, Hapus"}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
