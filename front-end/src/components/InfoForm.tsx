import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  senderName: z
    .string()
    .min(2, { message: "Sender name must be at least 2 characters." })
    .nonempty("Sender name is required"),
  senderAddress: z
    .string()
    .min(2, { message: "Sender address must be at least 2 characters." })
    .nonempty("Sender address is required"),
  receiverName: z
    .string()
    .min(2, { message: "Receiver name must be at least 2 characters." })
    .nonempty("Receiver name is required"),
  receiverAddress: z
    .string()
    .min(2, { message: "Receiver address must be at least 2 characters." })
    .nonempty("Receiver address is required"),
  packageWeight: z.string().nonempty("Package weight is required."),
  length: z
    .string()
    .nonempty("Length is required.")
    .refine((value) => parseFloat(value) > 0, {
      message: "Length must be greater than zero.",
    }),
  width: z
    .string()
    .nonempty("Width is required.")
    .refine((value) => parseFloat(value) > 0, {
      message: "Width must be greater than zero.",
    }),
  height: z
    .string()
    .nonempty("Height is required.")
    .refine((value) => parseFloat(value) > 0, {
      message: "Height must be greater than zero.",
    }),
});


function InfoForm() {
  const { toast } = useToast();
  const [labelUrl, setLabelUrl] = useState<string | null>(null);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senderName: "",
      senderAddress: "",
      receiverName: "",
      receiverAddress: "",
      packageWeight: "",
      length: "",
      width: "",
      height: "",
    },
  });

  async function onSubmit(values: any) {
    try {
      const response = await axios.post(
        "http://localhost:8000/create-shipping-label",
        values
      );
      setLabelUrl(response.data.labelUrl);

      toast({
        title: "Shipping Label Created",
      });

      form.reset(); // Reset form fields to empty after submission
    } catch (error: any) {
      let errorMessage = "Unknown error occurred";

      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: `Error creating shipment: ${errorMessage}`,
      });
    }
  }

  return (
    <section className="flex flex-col gap-y-5 w-[60%] min-h-[60svh]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="senderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sender Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter sender name here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senderAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sender Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter sender address here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receiverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receiver Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter receiver name here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receiverAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receiver Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter receiver address here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full justify-between">
            <FormField
              control={form.control}
              name="packageWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Weight (kg)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter package weight" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Length (cm)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter package length" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Width (cm)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter package width" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Height (cm)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter package height" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2">
            <Button className="flex items-center gap-2" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
      {labelUrl && (
        <a className="w-36" href={labelUrl} target="_blank">
          <Button rel="noopener noreferrer" className="bg-black text-white">
            View Shipping Label
          </Button>
        </a>
      )}
    </section>
  );
}

export default InfoForm;
