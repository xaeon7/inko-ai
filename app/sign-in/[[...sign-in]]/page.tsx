import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid place-content-center w-full h-full">
      <SignIn redirectUrl={"/chat"} />
    </div>
  );
}
