import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { PlusCircle, Trash2, Receipt } from "lucide-react";
import { formatCurrency, parseCurrency } from "@/lib/utils";

interface Item {
    name: string;
    price: string;
    quantity: number;
}

interface ItemsCardProps {
    items: Item[];
    onItemsChange: (items: Item[]) => void;
    errors: Partial<
        Record<`items.${number}.name` | `items.${number}.price`, string>
    >;
}

export function ItemsCard({ items, onItemsChange, errors }: ItemsCardProps) {
    const handleFieldChange = (
        index: number,
        field: keyof Item,
        value: string | number
    ) => {
        const updatedItems = items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        onItemsChange(updatedItems);
    };

    const handlePriceChange = (index: number, value: string) => {
        const parsedValue = parseCurrency(value);
        handleFieldChange(index, "price", parsedValue);
    };

    const addItem = () => {
        onItemsChange([...items, { name: "", price: "0", quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        onItemsChange(items.filter((_, i) => i !== index));
    };

    const totalFromItems = items.reduce(
        (sum, item) =>
            sum + (parseFloat(item.price) || 0) * (item.quantity || 1),
        0
    );

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-3">
                    <Receipt className="h-6 w-6 text-blue-500" />
                    Daftar Item
                </h2>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Tambah Item
                </Button>
            </div>

            <div className="p-6 space-y-4">
                {items.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                        <p>Belum ada item. Silakan tambahkan.</p>
                    </div>
                ) : (
                    items.map((item, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-12 gap-2 items-start"
                        >
                            <div className="col-span-5">
                                <Input
                                    placeholder="Nama Item"
                                    value={item.name}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            index,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors[`items.${index}.name`] && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors[`items.${index}.name`]}
                                    </p>
                                )}
                            </div>
                            <div className="col-span-2">
                                <Input
                                    placeholder="Jml"
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            index,
                                            "quantity",
                                            parseInt(e.target.value) || 1
                                        )
                                    }
                                />
                            </div>
                            <div className="relative col-span-4">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    Rp
                                </span>
                                <Input
                                    placeholder="Harga"
                                    value={formatCurrency(item.price)}
                                    onChange={(e) =>
                                        handlePriceChange(index, e.target.value)
                                    }
                                    className="pl-9 text-right"
                                />
                                {errors[`items.${index}.price`] && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors[`items.${index}.price`]}
                                    </p>
                                )}
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(index)}
                                className="col-span-1 text-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))
                )}
            </div>

            <div className="p-6 bg-gray-50 text-right font-semibold border-t">
                Total Item: Rp {formatCurrency(totalFromItems)}
            </div>
        </div>
    );
}
