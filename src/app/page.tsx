import Link from "next/link";

export default function Home() {
  return(
  <section>

    <h1 className="text-slate-800 font-bold text-5xl">
Home Page
    </h1>

    <div className="text-center mt-7">
      <Link className="text-blue-800 underline text-2xl rounded-lg" href="/login">
      Go to login page
      </Link>
    </div>

  </section>
  )
}