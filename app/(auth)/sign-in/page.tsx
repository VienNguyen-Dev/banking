import AuthForm from "@/components/form/AuthForm";

const SignIn = async () => {
  return (
    <section className=" flex-center size-full max-sm:py-6">
      <AuthForm type="sign-in" />
    </section>
  );
};

export default SignIn;
