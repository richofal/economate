import React from "react";
import { Wallet } from "@/types";

interface WalletSelectorProps {
    availableWallets: Wallet[];
    selectedWalletId: string | number;
    newWalletName: string;
    onWalletChange: (value: string) => void;
    onNewWalletNameChange: (name: string) => void;
    error?: string;
}

export const WalletSelector: React.FC<WalletSelectorProps> = ({
    availableWallets,
    selectedWalletId,
    newWalletName,
    onWalletChange,
    onNewWalletNameChange,
    error,
}) => {
    const isCreatingNew = selectedWalletId === "new";

    return (
        <div className="space-y-4">
            <div>
                <label
                    htmlFor="wallet_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Jenis Dompet
                </label>
                <select
                    id="wallet_id"
                    name="wallet_id"
                    required
                    className={`mt-1 block w-full pl-3 pr-10 py-2.5 border ${
                        error && !isCreatingNew
                            ? "border-red-500"
                            : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    value={selectedWalletId}
                    onChange={(e) => onWalletChange(e.target.value)}
                >
                    <option value="0" disabled>
                        Pilih Dompet
                    </option>
                    {availableWallets.map((wallet) => (
                        <option key={wallet.id} value={wallet.id}>
                            {wallet.name}
                        </option>
                    ))}
                    <option value="new" className="font-bold text-blue-600">
                        + Buat Wallet Baru...
                    </option>
                </select>
                {error && !isCreatingNew && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>

            {isCreatingNew && (
                <div>
                    <label
                        htmlFor="new_wallet_name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Nama Wallet Baru
                    </label>
                    <input
                        type="text"
                        id="new_wallet_name"
                        name="new_wallet_name"
                        value={newWalletName}
                        onChange={(e) => onNewWalletNameChange(e.target.value)}
                        placeholder="e.g., Dompet Digital, Rekening Bank"
                        className={`mt-1 block w-full py-2.5 border ${
                            error && isCreatingNew
                                ? "border-red-500"
                                : "border-gray-300"
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        required
                    />
                    {error && isCreatingNew && (
                        <p className="mt-1 text-sm text-red-600">{error}</p>
                    )}
                </div>
            )}
        </div>
    );
};
