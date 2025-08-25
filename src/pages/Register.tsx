import SEO from "@/components/SEO";
import Auth from "./Auth";

export default function Register() {
  return (
    <>
      <SEO title="Register" description="Create an account" />
      <Auth defaultMode="signup" />
    </>
  );
}
