import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export function BackArrowIcon({ className = "back-arrow-icon" }: { className?: string }) {
  return <ArrowLeft aria-hidden="true" className={className} strokeWidth={2.25} />;
}

type BackLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "children" | "className">;

export function BackLink({ href, children, className = "back-link", ...props }: BackLinkProps) {
  return (
    <Link className={className} href={href} {...props}>
      <BackArrowIcon />
      <span>{children}</span>
    </Link>
  );
}
