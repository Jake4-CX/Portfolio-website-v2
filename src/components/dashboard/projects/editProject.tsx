import { assignProjectImages, updateProject } from "@/api/projects";
import { createPresignedUrl } from "@/api/storage";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { DropzoneOptions } from "react-dropzone";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { format } from "date-fns"
import { cn } from "@/lib/utils";
import FileUploadCard from "@/components/global/cards/fileUpload";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { getTechnologies } from "@/api/technologies";
import { ScrollArea } from "@/components/ui/scroll-area";
import { uploadImage } from "@/lib/uploadS3";
import { urlToFile } from "@/lib/technology";

const formSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  projectDescription: z.string().min(1, "Project description is required"),
  isFeatured: z.boolean(),
  startDate: z.date(),
  endDate: z.date().optional(), // Optional
  projectTechnologies: z.array(z.string()).min(1, "At least one technology is required"),
  projectImages: z
    .array(z.instanceof(File))
    .max(5, "A maximum of 5 images are allowed")
    .optional(),
  githubURL: z.string().url().or(z.literal('')).optional(),
  websiteURL: z.string().url().or(z.literal('')).optional(),
  youtubeURL: z.string().url().or(z.literal('')).optional()
})

interface EditProjectModalProps {
  project: Project
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ project }) => {

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: project.projectName,
      projectDescription: project.projectDescription,
      isFeatured: project.isFeatured,
      startDate: new Date(project.startDate), // Convert number to date
      endDate: project.endDate != null ? new Date(project.endDate) : undefined, // ToDo: Convert number to date
      // @ts-expect-error - projectTechnologies is expected to be an array of ProjectTechnology
      projectTechnologies: project.projectTechnologies?.map((technology: ProjectTechnology | number) => (!(technology instanceof Number)) ? technology.technologyId.toString() : null) ?? [],
      projectImages: [],
      githubURL: project.projectURLs?.githubURL ?? "",
      websiteURL: project.projectURLs?.websiteURL ?? "",
      youtubeURL: project.projectURLs?.youtubeURL ?? ""
    }
  });

  useEffect(() => {
    async function fetchImage(productImages: ProjectImage[]) {

      const files: File[] = [];
      let i = 0;

      for (const image of productImages) {
        try {
          console.log("image: ", image);
          const file = await urlToFile(image.imageURL, `current-image-${i + 1}`);
          if (file) {
            files.push(file);
          }
        } catch (error) {
          console.error("Failed to fetch and convert image:", error);
        }
        i++;
      }

      form.setValue("projectImages", files);
      setFiles(files);
    }
    if (project.projectImages) {
      fetchImage(project.projectImages);
    }
  }, [project.projectImages, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateProject,
    onSuccess: (response) => {
      toast.success("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: [`projects`] });
      setIsOpen(false);

      const updatedProject = (response.data.project as Project);

      // Now, upload the images
      if (updatedProject.id) {
        const formValues: z.infer<typeof formSchema> = form.getValues();
        uploadImages(updatedProject.id, formValues.projectImages);
      }
    },
    onError: () => {
      toast.error("Failed to update project");
    }
  });

  async function uploadImages(projectID: number, images: File[] | undefined) {

    const uploadedImages: string[] = []; // Array to store uploaded image URLs

    console.log("Uploading images...");

    if (images) {
      for (const file of images) {

        if (file.size > 1024 * 1024 * 4) {
          toast.error("Image size must be less than 4MB");
          return;
        }

        const presigned_url = await createPresignedUrl("PROJECT_IMAGE");
        if (!presigned_url || !presigned_url.data.url) {
          toast.error("Failed to create presigned URL");
          console.error(`Failed to create presigned URL for image named: ${file.name}.${file.type}`);
          return
        }

        try {
          const uploadUrl = presigned_url.data.url;
          // upload the image to the S3 bucket
          const uploadedImageURL = await uploadImage(file, uploadUrl);

          uploadedImages.push(uploadedImageURL);
        } catch (error) {
          toast.error("Failed to upload image");
          console.error(error);
        }
      }

      if (uploadedImages.length > 0) {
        // Update project with the uploaded images
        // TODO: get the project ID from the response
        assignProjectImages(projectID, uploadedImages);
      }
    }

  }

  const getTechnologiesQuery = useQuery({
    queryKey: ["technologies"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {

      const technologiesResponse = await getTechnologies();

      const data = (technologiesResponse.data).technologies as Technology[];

      return data;
    }
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);

    const sendData: Project = {
      id: project.id,
      projectName: data.projectName,
      projectDescription: data.projectDescription,
      isFeatured: data.isFeatured,
      startDate: (data.startDate instanceof Date) ? data.startDate.getTime() : data.startDate as number, // Turn date into number
      endDate: data.endDate ? data.endDate.getTime() : null, // Turn date into number
      projectTechnologies: data.projectTechnologies.map((techId) => parseInt(techId)),
      projectImages: undefined,
      projectURLs: {
        id: undefined,
        projectId: project.id,
        githubURL: data.githubURL,
        websiteURL: data.websiteURL,
        youtubeURL: data.youtubeURL
      }
    };

    console.log("data to send: ", sendData);

    mutate(sendData);
  }

  function onError(errors: unknown) {
    console.log("errors: ", errors);
    toast.error("Please fill in all required fields");
  }

  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  } satisfies DropzoneOptions;

  const optionsTechnologies: Option<string>[] | undefined = getTechnologiesQuery.data ?
    getTechnologiesQuery.data.map((technology) => ({
      label: technology.technologyName,
      value: technology.id.toString()
    })) : undefined;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild className="flex justify-center items-center">
          <Button className="w-full md:w-fit" variant="outline" size="sm">Edit</Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent className="max-w-[36rem]">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Subheading here
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">

                <div className="flex flex-col sm:flex-row justify-between content-end sm:space-x-3 space-y-3 sm:space-y-0">
                  {/* Project Name */}
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="projectName">Project Name<span className="text-red-500">*</span></FormLabel>
                        <Input
                          id="projectName"
                          {...field}
                          className="col-span-3"
                          type="text"
                          placeholder="Enter project name"
                        />
                        <FormMessage {...field} />
                      </FormItem>
                    )}
                  />

                  {/* Is Featured */}
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="sm:w-1/3 justify-end">
                        <FormLabel htmlFor="isFeatured">Is Featured</FormLabel>
                        <FormControl>
                          <div className="flex flex-row justify-center space-x-3 space-y-0 rounded-md border px-2 py-[11px] w-full h-fit">
                            <Checkbox
                              id="isFeatured"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage {...field} />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Project Description */}
                <FormField
                  control={form.control}
                  name="projectDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="projectDescription">Project Description<span className="text-red-500">*</span></FormLabel>
                      <Textarea
                        placeholder="Enter project description"
                        {...field}
                        className="col-span-3"
                      />
                      <FormMessage {...field} />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
                  {/* Start Date */}
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <>
                        <FormItem className="flex flex-col">
                          <FormLabel htmlFor="startDate">Start Date<span className="text-red-500">*</span></FormLabel>
                          <Popover modal={true}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full sm:w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={new Date(field.value)}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      </>
                    )}
                  />

                  {/* End Date */}
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <>
                        <FormItem className="flex flex-col">
                          <FormLabel htmlFor="endDate">End Date</FormLabel>
                          <Popover modal={true}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full sm:w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  disabled={!form.getValues("startDate")}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : new Date()}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01") || date < new Date(form.getValues("startDate"))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      </>
                    )}
                  />
                </div>

                {/* Project Technologies - Multiple select box - TODO */}
                <FormField
                  control={form.control}
                  name="projectTechnologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="projectTechnologies">Project Technologies<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <MultipleSelector
                          {...field}
                          options={optionsTechnologies} // Convert options to array of Option objects
                          hidePlaceholderWhenSelected
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                {/* Project Photos uploader */}
                <FormField
                  control={form.control}
                  name="projectImages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="projectPhotos">Project Images</FormLabel>
                      <FileUploader
                        value={files}
                        onValueChange={(uploadedFiles) => {
                          setFiles(uploadedFiles);
                          form.setValue(field.name, uploadedFiles || []);
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

                {/* Project Links */}

                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Project Links</AccordionTrigger>
                    <AccordionContent>
                      <ScrollArea className="h-[8rem] w-full rounded-md border p-4">
                        <div className="space-y-4">
                          {/* GitHub Repo URL */}
                          <FormField
                            control={form.control}
                            name="githubURL"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="githubURL">GitHub Repo URL</FormLabel>
                                <Input
                                  id="githubURL"
                                  {...field}
                                  type="text"
                                  placeholder="Enter GitHub repo URL"
                                />
                                <FormMessage {...field} />
                              </FormItem>
                            )}
                          />

                          {/* Deployed Website URL */}
                          <FormField
                            control={form.control}
                            name="websiteURL"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="websiteURL">Deployed Website URL</FormLabel>
                                <Input
                                  id="websiteURL"
                                  {...field}
                                  type="text"
                                  placeholder="Enter deployed website URL"
                                />
                                <FormMessage {...field} />
                              </FormItem>
                            )}
                          />

                          {/* YouTube Video URL */}
                          <FormField
                            control={form.control}
                            name="youtubeURL"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="youtubeURL">YouTube Video URL</FormLabel>
                                <Input
                                  id="youtubeURL"
                                  {...field}
                                  type="text"
                                  placeholder="Enter YouTube video URL"
                                />
                                <FormMessage {...field} />
                              </FormItem>
                            )}
                          />

                        </div>
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>


                {/* Submit */}
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
                          Update Project
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

export default EditProjectModal;