import { contact } from "@/api/contact";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";
import { createRef } from "react";

const formSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
  recaptcha: z.string().min(1, "Please complete the recaptcha"),
});

const ContactSection: React.FC = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const recaptchaRef = createRef<ReCAPTCHA>();

  const { mutate, isPending } = useMutation({
    mutationFn: contact,
    mutationKey: ["contact"],
    onSuccess: () => {
      form.reset();
      recaptchaRef.current?.reset();

      toast.success("Message sent successfully");
    },
    onError: (error) => {
      toast.error("Failed to send message");
      console.error("Contact form submission error: ", error.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <>
      <Card id="contact" className="flex flex-col items-center justify-center h-fit w-full max-w-[60.625rem]">
        <CardHeader className="w-full px-8 lg:px-4">
          <CardTitle>Contact</CardTitle>
          <CardDescription>Get in touch with me</CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-center w-full">

          <Card className="w-full max-w-[30rem] py-6 sm:p-6">
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">Name<span className="text-red-500">*</span></FormLabel>
                        <Input
                          {...field}
                          placeholder="John Doe"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email<span className="text-red-500">*</span></FormLabel>
                        <Input
                          {...field}
                          placeholder="john.doe@email.com"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Message - text area */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="message">Message<span className="text-red-500">*</span></FormLabel>
                        <Textarea
                          placeholder="Your message here"
                          className="col-span-3"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* reCaptcha V2 */}
                  <Controller
                    control={form.control}
                    name="recaptcha"
                    defaultValue={undefined}
                    render={({ field: { onChange, value } }) => (
                      <ReCAPTCHA
                        className="flex items-center justify-center h-[4.875rem]"
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? ""}
                        ref={recaptchaRef}
                        onChange={(token) => token !== null && onChange(token)}
                        onExpired={() => onChange(undefined)}
                        defaultValue={value}
                      />
                    )}
                  />

                  {/* Button */}
                  <div className="flex w-full items-end justify-end">
                    <Button type="submit" className="w-full sm:w-fit select-none" disabled={isPending}>
                      {
                        isPending ? (
                          <>
                            <RefreshCw className="animate-spin w-4 h-4 mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                          </>
                        )
                      }
                    </Button>
                  </div>
                </form>
              </Form>

            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </>
  )
}

export default ContactSection;