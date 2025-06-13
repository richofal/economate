import { Config } from "ziggy-js";

export interface User {
    id: number;
    name: string;
    email: string;
    address?: string;
    phone?: string;
    // Timestamps~
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    roles: string[];
    permissions: string[];
    is_customer: boolean;
    is_lead: boolean;
    is_sales: boolean;
    is_manager: boolean;
    is_admin: boolean;
    subscriptions?: Subscription[];
    approved_subscriptions?: Subscription[];
    created_subscriptions?: Subscription[];
    cancelled_subscriptions?: Subscription[];
    offers?: Offer[];
    created_offers?: Offer[];
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

export interface Category {
    id: number;
    name: string;
    description: string;
    slug: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    products: Product[];
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    address?: string;
    phone?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    subscriptions?: Subscription[];
}

export interface Subscription {
    id: number;
    user: User;
    product_price: ProductPrice;
    approved_by: Manager;
    subscription_number: string;
    start_date: string;
    end_date: string;
    next_billing_date: string;
    contract_length_months: number;
    status: string;
    approval_requested_at: string | null;
    approved_at: string | null;
    approval_notes: string | null;
    auto_renew: boolean;
    cancelled_at: string | null;
    cancellation_notes: string | null;
    rejected_notes: string | null;
    rejected_at: string | null;
    created_at: string;
}

export interface Manager {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    approvedSubscriptions: Subscription[];
}

export interface ProductPrice {
    product: Product;
    id: number;
    billing_cycle: string;
    term_months: number;
    price: number;
    status: string;
    offers: Offer[];
    subscriptions: Subscriptions[];
}

export interface Product {
    id: number;
    name: string;
    code: string;
    description: string;
    bandwidth: number;
    bandwidth_type: string;
    connection_type: string;
    uptime_guarantee: number;
    setup_fee: number;
    minimum_contract_months: number;
    is_recurring: boolean;
    is_active: boolean;
    is_featured: boolean;
    category: Category;
    product_prices: ProductPrice[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Offer {
    id: number;
    offer_number: string;
    status:
        | "pending"
        | "accepted"
        | "rejected"
        | "expired"
        | "converted"
        | "cancelled";
    contract_length_months: number;
    auto_renew: boolean;
    created_at?: string;
    updated_at?: string;
    lead: Lead;
    product_price: ProductPrice;
    created_by: Sales;
}

export interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    offers: Offer[];
}

export interface Sales {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    created_offers: Offer[];
}

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
