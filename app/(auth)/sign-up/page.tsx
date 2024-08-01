import AuthForm from "@/components/form/AuthForm";
import { getLoggedInUser } from "@/lib/actions/user.action";

const SignUp = async () => {
  const loggedIn = await getLoggedInUser();
  console.log(loggedIn);
  return (
    <section className=" flex-center size-full max-sm:py-6">
      <AuthForm type="sign-up" />
    </section>
  );
};

export default SignUp;
