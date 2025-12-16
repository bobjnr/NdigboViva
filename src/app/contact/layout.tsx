import { contactSEO } from '@/lib/seo';

export const metadata = contactSEO;

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
