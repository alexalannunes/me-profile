import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-slate-200">
      <h1 className="text-center text-4xl font-bold md:text-5xl">
        Create your own page
      </h1>

      <Button size="lg" as={"a"} href="/login" color="primary" variant="shadow">
        Create my page
      </Button>

      <Link to="/login" className="text-blue-600 hover:underline">
        Already have an account. Login
      </Link>
    </div>
  );
}
