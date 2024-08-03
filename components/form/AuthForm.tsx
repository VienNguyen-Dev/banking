"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authFormSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.action";
import PlaidLink from "../PlaidLink";
const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    console.log(values);
    try {
      //Sign up with Appwrite and create flaid token
      if (type === "sign-up") {
        const userData = {
          firstName: values.firstName!,
          lastName: values.lastName!,
          email: values.email,
          address1: values.address1!,
          city: values.city!,
          state: values.state!,
          dateOfBirth: values.dateOfBirth!,
          ssn: values.ssn!,
          postalCode: values.postalCode!,
          password: values.password,
        };
        //Take data from frontend
        const newUser = await signUp(userData);
        if (newUser) setUser(newUser);
      }
      if (type === "sign-in") {
        const response = await signIn({
          email: values.email,
          password: values.password,
        });
        if (response) router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const submitLabel = type === "sign-in" ? "Sign In" : "Sign Up";
  return (
    <section className="auth-form">
      <header className=" flex flex-col gap-5 mb-8">
        <Link href={"/"} className="flex  items-center cursor-pointer gap-1">
          <Image src={"/icons/logo.svg"} alt="Horizon logo" width={34} height={34} />
          <h1 className=" text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
        </Link>
        <div className=" flex flex-col gap-2 md:gap-3">
          <h1 className=" font-semibold text-24 lg:text-36">{user ? " Link access Account" : type === "sign-in" ? "Sign In" : "Sign Up"}</h1>
          <p className="text-16 text-gray-600 font-normal">{user ? "Link your account to get started" : "Please enter your details."}</p>
        </div>
      </header>
      {/* Authentication user */}
      {user ? (
        <div className=" flex flex-col gap-4">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-in" ? (
                <>
                  <CustomInput name="email" placeholder="Enter your Email" control={form.control} label="Email" />
                  <CustomInput name="password" placeholder="Enter your Password" control={form.control} label="Password" />
                </>
              ) : (
                <>
                  <div className="flex gap-4">
                    <CustomInput name="firstName" placeholder="Nguyen" control={form.control} label="First Name" />
                    <CustomInput name="lastName" placeholder="Vien" control={form.control} label="Last Name" />
                  </div>
                  <CustomInput name="address1" placeholder="Enter your specific address" control={form.control} label="Address" />
                  <CustomInput name="city" placeholder="Example: Newyork" control={form.control} label="City" />
                  <div className="flex gap-4">
                    <CustomInput name="state" placeholder="Example:NY, CA" control={form.control} label="State" />
                    <CustomInput name="postalCode" placeholder="Example: 11101" control={form.control} label="Postal Code" />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput name="dateOfBirth" placeholder="YYYY-MM-DD" control={form.control} label="Date of Birth" />
                    <CustomInput name="ssn" placeholder="Example: 1234" control={form.control} label="SSN" />
                  </div>
                  <CustomInput name="email" placeholder="Enter your Email" control={form.control} label="Email" />
                  <CustomInput name="password" placeholder="Enter your Password" control={form.control} label="Password" />
                </>
              )}
              <Button disabled={isLoading} className="form-btn w-full" type="submit">
                {isLoading ? (
                  <>
                    <Loader2 className=" animate-spin" size={20} />
                    &nbsp; Loading...
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            </form>
          </Form>
        </>
      )}
      <footer className="flex justify-center gap-1">
        <p className="text-14 font-normal text-gray-600">{type === "sign-in" ? "Don't have an acount?" : "Already have an account?"}</p>
        <Link href={type === "sign-in" ? "/sign-up" : "/sign-in"} className="form-link">
          {type === "sign-in" ? "Sign up" : "Login"}
        </Link>
      </footer>
    </section>
  );
};

export default AuthForm;
