import { createPresignedUrl } from "@/api/storage";
import { updateTechnology } from "@/api/technologies";
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
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload";
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
import { urlToFile } from "@/lib/technology";
import { uploadImage } from "@/lib/uploadS3";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { DropzoneOptions } from "react-dropzone";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  technologyName: z.string().min(1, "Technology name is required"),
  technologyType: z.enum(["LANGUAGE", "FRAMEWORK", "DATABASE", "TOOL", "OTHER"]),
  technologyImage: z
    .array(z.instanceof(File))
    .min(1, "Technology image is required")
    .max(1, "Only one image is allowed"),
});

interface EditTechnologyModalProps {
  technology: Technology
}

const EditTechnologyModal: React.FC<EditTechnologyModalProps> = ({ technology }) => {

  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      technologyName: technology.technologyName,
      technologyType: technology.technologyType,
      technologyImage: []
    }
  });

  useEffect(() => {
    async function fetchImage() {
      try {
        const file = technology.technologyImage ? await urlToFile(technology.technologyImage, "current-image") : null;
        if (file) {
          setFiles([file]);
          form.setValue("technologyImage", [file]);
        }
      } catch (error) {
        console.error("Failed to fetch and convert image:", error);
      }
    }
    if (technology.technologyImage) {
      fetchImage();
    }
  }, [technology.technologyImage, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateTechnology,
    onSuccess: () => {
      toast.success("Technology updated successfully");
      queryClient.invalidateQueries({ queryKey: [`technologies`] });
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to update technology");
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

      // update technology's database record
      mutate({
        technologyID: technology.id,
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
    toast.error("Failed to edit technology");
  }

  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  } satisfies DropzoneOptions;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild className="flex justify-center items-center">
          <Button className="w-full md:w-fit" variant="outline" size="sm">Edit</Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent className="max-w-[36rem]">
            <DialogHeader>
              <DialogTitle>Edit Technology</DialogTitle>
              <DialogDescription>
                Subheading here
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
                            <FileInput className="outline-dashed outline-1 outline-white">
                              <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                                <svg
                                  className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 20 16"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                  />
                                </svg>
                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">Click to upload</span>
                                  &nbsp; or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  SVG, PNG, JPG or GIF
                                </p>
                              </div>
                            </FileInput>
                            <FileUploaderContent>
                              {
                                files?.map((file, i) => (
                                  <FileUploaderItem key={i} index={i} aria-roledescription={`${file.name}`} className="h-fit items-center justify-center">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      className="h-8 w-8"
                                    />
                                    <span>{file.name}</span>
                                  </FileUploaderItem>
                                ))
                              }
                            </FileUploaderContent>
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
                          Updating...
                        </>
                      ) : (
                        <>
                          Update Technology
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

export default EditTechnologyModal;