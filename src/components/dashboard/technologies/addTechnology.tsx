import { createPresignedUrl } from "@/api/storage";
import { addTechnology } from "@/api/technologies";
import FileUploadCard from "@/components/global/cards/fileUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogFooter
} from "@/components/ui/dialog"
import { FileUploader } from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { uploadImage } from "@/lib/uploadS3";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { DropzoneOptions } from "react-dropzone";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const AddTechnologyComponent: React.FC = () => {

  return (
    <>
      <AddTechnologyModal />
    </>
  )
}

const formSchema = z.object({
  technologyName: z.string().min(1, "Technology name is required"),
  technologyType: z.enum(["LANGUAGE", "FRAMEWORK", "DATABASE", "TOOL", "OTHER"]),
  technologyImage: z
    .array(z.instanceof(File))
    .min(1, "Technology image is required")
    .max(1, "Only one image is allowed"),
});

interface AddTechnologyModalProps {
}

const AddTechnologyModal: React.FC<AddTechnologyModalProps> = () => {

  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      technologyName: "",
      technologyType: "LANGUAGE",
      technologyImage: []
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addTechnology,
    onSuccess: () => {
      toast.success("Technology added successfully");
      queryClient.invalidateQueries({ queryKey: [`technologies`] });
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to add technology");
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    // check if an image exists
    if (values.technologyImage.length === 0) {
      toast.error("Technology image is required");
      return;
    }

    // check if the image is valid

    if (values.technologyImage[0].size > 1024 * 1024 * 4) {
      toast.error("Image size must be less than 4MB");
      return;
    }

    // create presigned URL for the image upload
    const presigned_url = await createPresignedUrl("TECHNOLOGY_IMAGE");
    if (!presigned_url || !presigned_url.data.url) {
      toast.error("Failed to create presigned URL");
      return
    }

    try {
      const uploadUrl = presigned_url.data.url;
      // upload the image to the S3 bucket
      const uploadedImageURL = await uploadImage(values.technologyImage[0], uploadUrl);

      // add the technology to the database
      mutate({
        technologyName: values.technologyName,
        technologyType: values.technologyType,
        technologyImage: uploadedImageURL
      });
    } catch (error) {
      toast.error("Failed to upload image or add technology");
      console.error(error);
    }
  }

  function onError(errors: unknown) {
    console.log("errors: ", errors);
    toast.error("Failed to add technology");
  }

  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".svg"],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  } satisfies DropzoneOptions;


  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild className="flex justify-center items-center">
          <Button className="w-full md:w-fit" variant={"default"}>Add Technology</Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent className="max-w-[36rem]">
            <DialogHeader>
              <DialogTitle>Add Technology</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new technology
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                <ScrollArea className="whitespace-nowrap w-full max-h-[30rem] lg:max-h-[42rem]">
                  <div className="space-y-2">
                    {/* Technology Name */}
                    <FormField
                      control={form.control}
                      name="technologyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="technologyName">Technology Name<span className="text-red-500">*</span></FormLabel>
                          <Input
                            id="technologyName"
                            {...field}
                            className="col-span-3"
                            type="text"
                            placeholder="Enter technology name"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Technology Type */}
                    <FormField
                      control={form.control}
                      name="technologyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="technologyType">Technology Type<span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select technology type" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {
                                technologyTypes.map((item) => (
                                  <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Technology Image - Upload Image */}
                    <FormField
                      control={form.control}
                      name="technologyImage"
                      render={() => (
                        <FormItem>
                          <FormLabel htmlFor="technologyImage">Technology Image<span className="text-red-500">*</span></FormLabel>
                          <FileUploader
                            value={files}
                            onValueChange={(uploadedFiles) => {
                              setFiles(uploadedFiles);
                              form.setValue("technologyImage", uploadedFiles || []);
                            }}
                            dropzoneOptions={dropZoneConfig}
                            className="relative bg-background rounded-lg p-2"
                          >
                            <FileUploadCard files={files} />
                          </FileUploader>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </div>
                </ScrollArea>

                <DialogFooter>
                  <Button type="submit" className="select-none" disabled={isPending}>
                    {
                      isPending ? (
                        <>
                          <RefreshCw className="animate-spin w-4 h-4 mr-2" />
                          Adding...
                        </>
                      ) : (
                        <>
                          Add Technology
                        </>
                      )
                    }
                  </Button>
                </DialogFooter>
              </form>
            </Form>

          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  )
}

const technologyTypes = [
  { label: "Language", value: "LANGUAGE" },
  { label: "Framework", value: "FRAMEWORK" },
  { label: "Database", value: "DATABASE" },
  { label: "Tool", value: "TOOL" },
  { label: "Other", value: "OTHER" },
];

export default AddTechnologyComponent;