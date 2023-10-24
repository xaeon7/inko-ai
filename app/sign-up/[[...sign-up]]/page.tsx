import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid place-content-center w-full h-full">
      <SignUp redirectUrl={"/chat"} />
    </div>
  );
}
