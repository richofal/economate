import { useForm } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, FormEvent, useEffect } from "react";
import { Wallet } from "@/types";
import { X, Save, Loader } from "lucide-react";

interface EditWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    wallet: Wallet | null;
}

export const EditWalletModal = ({
    isOpen,
    onClose,
    wallet,
}: EditWalletModalProps) => {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: "",
        description: "",
    });

    useEffect(() => {
        if (wallet) {
            setData({
                name: wallet.name,
                description: wallet.description || "",
            });
        }
    }, [wallet]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!wallet) return;
        put(route("wallets.update", wallet.id), {
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
                                    className="flex items-center justify-between px-6 py-4 border-b"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Edit Dompet
                                    </h3>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={24} />
                                    </button>
                                </Dialog.Title>
                                <form
                                    onSubmit={submit}
                                    className="p-6 space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="edit-name"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Nama Dompet{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            id="edit-name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className={`w-full rounded-lg border ${
                                                errors.name
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="edit-description"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Deskripsi
                                        </label>
                                        <textarea
                                            id="edit-description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full rounded-lg border ${
                                                errors.description
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            rows={3}
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg"
                                            disabled={processing}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4 mr-2" />
                                            )}
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
