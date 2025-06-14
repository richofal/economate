import { Config } from "ziggy-js";

export interface User {
    id: number;
    name: string;
    email: string;
    address?: string;
    phone?: string;
    image?: string | null;
    birth_date?: string | null;
    gender?: string | null;
    status: string;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    roles: string[];
    permissions: string[];
    userWallets?: UserWallet[];
    budgetPlans?: BudgetPlan[];
}

export interface Wallet {
    id: number;
    name: string;
    description?: string | null;
    created_at?: string;
    updated_at?: string;
    userWallets?: UserWallet[];
}

export interface UserWallet {
    id: number;
    user_id: number;
    wallet_id: number;
    balance: string;
    created_at?: string;
    updated_at?: string;
    user?: User;
    wallet?: Wallet;
    transactions?: Transaction[];
}

export type PaginatedData<T> = {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };

    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;

        links: {
            url: null | string;
            label: string;
            active: boolean;
        }[];
    };
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    flash: {
        success: string | null;
        error: string | null;
    };
    ziggy: Config & { location: string };
};
