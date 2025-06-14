import { Fragment, useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { Wallet } from "@/types";
import { WalletSelector } from "./WalletSelector";
import { X, Loader, Wallet as WalletIcon, Plus } from "lucide-react";

interface CreateUserWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableWallets: Wallet[];
}

export const CreateUserWalletModal: React.FC<CreateUserWalletModalProps> = ({
    isOpen,
    onClose,
    availableWallets,
}) => {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            wallet_id: "0",
            new_wallet_name: "",
            balance: "0",
        });

    const [isDirty, setIsDirty] = useState(false);
    const [displayBalance, setDisplayBalance] = useState("Rp 0");

    useEffect(() => {
        if (isOpen) {
            reset();
            clearErrors();
            setDisplayBalance("Rp 0");
            setIsDirty(false);
        }
    }, [isOpen]);

    const formatAsCurrency = (value: string | number) => {
        const numericValue = Number(String(value).replace(/[^\d]/g, ""));
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numericValue);
    };

    const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^\d]/g, "");
        setData("balance", rawValue || "0");
        setDisplayBalance(formatAsCurrency(rawValue));
        setIsDirty(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("userWallets.store"), {
            onSuccess: () => onClose(),
            preserveState: true,
            onError: (errs) => {
                const firstErrorField = Object.keys(errs).shift();
                if (firstErrorField) {
                    const element = document.getElementById(firstErrorField);
                    element?.focus();
                }
            },
        });
    };

    const closeModal = () => {
        if (isDirty && !processing) {
            if (
                !window.confirm(
                    "Perubahan Anda belum disimpan. Yakin ingin menutup?"
                )
            ) {
                return;
            }
        }
        onClose();
    };

    const isCreatingNewWalletType = data.wallet_id === "new";

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="div"
                                    className="bg-blue-600 px-6 py-4 flex justify-between items-center"
                                >
                                    <h3 className="text-lg font-semibold text-white flex items-center">
                                        <WalletIcon className="h-5 w-5 mr-2" />
                                        Tambah Dompet Baru
                                    </h3>
                                    <button
                                        onClick={closeModal}
                                        className="text-white/80 hover:text-white rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        disabled={processing}
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="px-6 py-5 space-y-5 bg-white">
                                        <WalletSelector
                                            availableWallets={availableWallets}
                                            selectedWalletId={data.wallet_id}
                                            newWalletName={data.new_wallet_name}
                                            onWalletChange={(value) =>
                                                setData("wallet_id", value)
                                            }
                                            onNewWalletNameChange={(name) =>
                                                setData("new_wallet_name", name)
                                            }
                                            error={errors.wallet_id}
                                        />

                                        {isCreatingNewWalletType && (
                                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
                                                <p className="text-blue-700">
                                                    Anda memilih untuk membuat
                                                    dompet baru. Pastikan nama
                                                    dompet unik dan tidak ada
                                                    duplikasi.
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <label
                                                htmlFor="balance"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Saldo Awal
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="balance"
                                                    inputMode="numeric"
                                                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                        errors.balance
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    value={displayBalance}
                                                    onChange={
                                                        handleBalanceChange
                                                    }
                                                />
                                            </div>
                                            {errors.balance && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.balance}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            disabled={processing}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader className="animate-spin h-4 w-4 mr-2" />{" "}
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="h-4 w-4 mr-2" />{" "}
                                                    Tambah Dompet
                                                </>
                                            )}
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
