// resources/js/Pages/Profile/Edit.tsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head, usePage } from "@inertiajs/react";
import { PageProps, User } from "@/types";

interface EditProfilePageProps extends PageProps {
    user: User;
}

export default function Edit() {
    const { user } = usePage<EditProfilePageProps>().props;

    return (
        <AuthenticatedLayout title="Edit Profil">
            <Head title="Profil" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow-lg sm:rounded-lg">
                        <UpdateProfileInformationForm
                            className="max-w-7xl"
                            user={user}
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow-lg sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-7xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
