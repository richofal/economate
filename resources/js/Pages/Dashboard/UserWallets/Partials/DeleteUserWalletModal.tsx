import { Fragment } from "react";
import { router } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteUserWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    walletId: number | null;
    walletName: string;
}

export const DeleteUserWalletModal: React.FC<DeleteUserWalletModalProps> = ({
    isOpen,
    onClose,
    walletId,
    walletName,
}) => {
    const handleDelete = () => {
        if (!walletId) return;
        router.delete(route("userWallets.destroy", walletId), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={onClose}
            >
                {/* ... (Transition.Child untuk Overlay sama seperti di Create Modal) ... */}
                <div className="flex items-center justify-center min-h-screen px-4">
                    <Transition.Child as={Fragment} /* ... */>
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
                            <div className="bg-red-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">
                                    Konfirmasi Hapus
                                </Dialog.Title>
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="px-6 py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-red-100 rounded-full p-2">
                                        <AlertTriangle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-medium text-gray-900">
                                            Hapus Dompet: {walletName}
                                        </h4>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Tindakan ini akan menghapus dompet
                                            beserta seluruh transaksi yang
                                            terkait. Tindakan ini tidak dapat
                                            dibatalkan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm"
                                    onClick={onClose}
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm"
                                    onClick={handleDelete}
                                >
                                    Hapus Dompet
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};
