import ChangePasswordForm from "@/components/Forms/ChangePasswordForm";

export default function Page({ params }: {
    params: { token: string }
}) {
    return (
        <ChangePasswordForm token={params.token} />
    )
}