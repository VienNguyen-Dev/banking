import AuthForm from "@/components/form/AuthForm";

const SignUp = async () => {
  return (
    <section className=" flex-center size-full max-sm:py-6">
      <AuthForm type="sign-up" />
    </section>
  );
};

export default SignUp;
