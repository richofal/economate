import { Fragment, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { UserWallet } from "@/types";
import { X, Save, Loader } from "lucide-react";

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    userWallet: UserWallet | null;
}

export const EditUserWalletModal: React.FC<EditModalProps> = ({
    isOpen,
    onClose,
    userWallet,
}) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        balance: "0",
        _method: "PUT",
    });

    useEffect(() => {
        if (userWallet) {
            setData("balance", userWallet.balance);
        }
    }, [userWallet]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userWallet) return;

        post(route("userWallets.update", userWallet.id), {
            onSuccess: () => closeModal(),
        });
    };

    const closeModal = () => {
        reset();
        onClose();
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={closeModal}
            >
                {/* ... (Transition.Child untuk Overlay sama seperti di Create Modal) ... */}
                <div className="flex items-center justify-center min-h-screen px-4">
                    <Transition.Child
                        as={Fragment} /* ... */
                    ></Transition.Child>
                    <Transition.Child as={Fragment} /* ... */>
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
                            <div className="bg-amber-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">
                                    Edit Dompet: {userWallet?.wallet?.name}
                                </Dialog.Title>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="px-6 py-4">
                                    <label
                                        htmlFor="balance_edit"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Saldo
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">
                                                Rp
                                            </span>
                                        </div>
                                        <input
                                            type="number"
                                            name="balance"
                                            id="balance_edit"
                                            className={`block w-full pl-10 pr-12 py-2.5 border ${
                                                errors.balance
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                            value={data.balance}
                                            onChange={(e) =>
                                                setData(
                                                    "balance",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    {errors.balance && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.balance}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-amber-600">
                                        Perubahan saldo akan tercatat sebagai
                                        penyesuaian manual.
                                    </p>
                                </div>
                                <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
                                        onClick={closeModal}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-amber-600 border border-transparent rounded-md shadow-sm hover:bg-amber-700 focus:outline-none"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Memperbarui..."
                                            : "Perbarui"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};
