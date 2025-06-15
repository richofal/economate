import { FormEvent, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { X, ReceiptText, Loader, Save } from "lucide-react";

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateSplitBillModal({ isOpen, onClose }: CreateModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
    });

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route("splitBills.store"), {
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
                                        <ReceiptText className="w-5 h-5 text-blue-600" />
                                        Buat Split Bill Baru
                                    </h3>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={20} />
                                    </button>
                                </Dialog.Title>

                                <form
                                    onSubmit={submit}
                                    className="p-6 space-y-4"
                                >
                                    <div>
                                        <Label htmlFor="title">
                                            Judul Tagihan
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            placeholder="Contoh: Makan Siang Tim"
                                            className="mt-1"
                                            required
                                        />
                                        {errors.title && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.title}
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
