"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/config";

type NavCat = { slug: string; name: string };
import { Icon } from "./Icon";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/production-equipment", label: "Certificates" },
  { href: "/contact-us", label: "Contact" },
];

export default function Header({ categories }: { categories: NavCat[] }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  useEffect(() => { setOpen(false); setProdOpen(false); }, [path]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  const isActive = (href: string) =>
    href === "/" ? path === "/" : href === "/products" ? path === "/products" || categories.some((c) => path.startsWith("/" + c.slug)) : path.startsWith(href);

  return (
    <>
      <div className="topbar">
        <div className="container topbar-in">
          <span className="topbar-addr"><Icon name="pin" size={15} /> {SITE.address}</span>
          <span className="topbar-right">
            <span className="hide-sm">{SITE.hours} &nbsp;|&nbsp; </span>
            <a href={`tel:${SITE.phoneTel}`}><Icon name="phone" size={15} /> {SITE.phone}</a>
          </span>
        </div>
      </div>
      <header className="header">
        <div className="container header-in">
          <Link href="/" className="brand brand-logo" aria-label="JD Frontier home">
            <img src="/uploads/201816806/logo348866.jpg" alt="Jiadi logo" width={90} height={55} />
            <span className="brand-text">
              <span className="brand-name">JD FRONTIER</span>
              <span className="brand-sub">AUTHORISED JIADI DEALER</span>
            </span>
          </Link>
          <nav className={`nav${open ? " is-open" : ""}`} aria-label="Main">
            <ul>
              {NAV.map((n) =>
                n.href === "/products" ? (
                  <li key={n.href} className={`has-sub${prodOpen ? " sub-open" : ""}`}>
                    <div className="nav-row">
                      <Link href={n.href} className={isActive(n.href) ? "active" : ""}>{n.label}</Link>
                      <button className="sub-toggle" aria-label="Show product categories" aria-expanded={prodOpen} onClick={() => setProdOpen(!prodOpen)}>
                        <Icon name="chevron" size={18} />
                      </button>
                    </div>
                    <ul className="sub">
                      {categories.map((c) => (
                        <li key={c.slug}><Link href={"/" + c.slug}>{c.name}</Link></li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={n.href}><Link href={n.href} className={isActive(n.href) ? "active" : ""}>{n.label}</Link></li>
                )
              )}
            </ul>
            <a href={`tel:${SITE.phoneTel}`} className="btn btn-orange nav-call"><Icon name="phone" size={18} /> Call {SITE.phone}</a>
          </nav>
          <Link href="/contact-us" className="btn btn-orange header-cta">Get a Quote</Link>
          <button className="burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            <Icon name={open ? "close" : "menu"} size={26} />
          </button>
        </div>
        {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}
      </header>
    </>
  );
}
