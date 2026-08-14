import Link from "next/link";

const navigation = [
  ["Services", "/services"],
  ["Corporate", "/corporate"],
  ["Airports", "/airports"],
  ["Our standard", "/standards"],
] as const;

export function BrandLockup({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`brand-lockup${inverse ? " brand-lockup--inverse" : ""}`} href="/" aria-label="Altaie home">
      <span className="brand-mark" aria-hidden="true" />
      <span className="brand-name">Altaie</span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <div className="header-shell">
        <BrandLockup />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <Link className="button button--dark header-cta" href="/book">Request a ride</Link>
        <details className="mobile-nav">
          <summary aria-label="Open navigation"><span /><span /></summary>
          <div className="mobile-nav__panel">
            {navigation.map(([label, href]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
            <Link href="/partner-network">Partner network</Link>
            <Link className="button button--brass" href="/book">Request a ride</Link>
          </div>
        </details>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-primary">
          <BrandLockup inverse />
          <p>Washington&apos;s executive mobility desk for schedules that cannot drift.</p>
          <Link className="text-link text-link--light" href="/book">Request a ride <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="footer-column">
          <p className="eyebrow eyebrow--light">Explore</p>
          <Link href="/services">Services</Link>
          <Link href="/corporate">Corporate travel</Link>
          <Link href="/airports">Airport service</Link>
          <Link href="/standards">Our standard</Link>
        </div>
        <div className="footer-column">
          <p className="eyebrow eyebrow--light">Company</p>
          <Link href="/contact">Contact</Link>
          <Link href="/partner-network">Partner network</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className="footer-legal">
        <span>© {new Date().getFullYear()} Altaie. Launch candidate; trademark clearance pending.</span>
        <span>Washington, DC · DCA · IAD · BWI</span>
      </div>
    </footer>
  );
}
