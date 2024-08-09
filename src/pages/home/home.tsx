import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-10 bg-slate-100 pt-24">
      <h1 className="text-center text-4xl font-bold md:text-6xl">
        Create your own page
      </h1>

      <Link
        to={"/login"}
        className="pointer mt-10 rounded-md bg-blue-600 px-8 py-3 text-xl font-[500] text-white shadow-[0_8px_22px_#2563eb59] hover:bg-blue-700"
      >
        Create my page
      </Link>
    </div>
  );
}
