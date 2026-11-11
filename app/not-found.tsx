import Link from "next/link";
export default function NotFound() {
  return (
    <section className="section container center narrow">
      <span className="kicker">404</span>
      <h1 className="h2">Page not found</h1>
      <p className="lead">The page you are looking for has moved or no longer exists.</p>
      <Link href="/products" className="btn btn-orange">Browse Products</Link>
    </section>
  );
}
