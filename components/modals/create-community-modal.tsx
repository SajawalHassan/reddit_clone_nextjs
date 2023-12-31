"use client";

import * as z from "zod";
import axios from "axios";

import { useModal } from "@/hooks/use-modal-store";
import { useForm } from "react-hook-form";

import { Separator } from "@/components/ui/seperator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createCommunityFormSchema } from "@/schemas/community-schema";

import { CommunityType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FileUploader } from "@/components/file-uploader";
import { useGlobalInfo } from "@/hooks/use-global-info";
import { useCommunityInfo } from "@/hooks/use-community-info";

export const CreateCommunityModal = () => {
  const { isOpen, type, closeModal } = useModal();
  const { setHeaderActivePlace } = useGlobalInfo();
  const { setCommunity, setCurrentMember } = useCommunityInfo();

  const modalIsOpen = isOpen && type === "createCommunity";
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createCommunityFormSchema),
    defaultValues: {
      name: "",
      uniqueName: "",
      imageUrl: "",
      type: CommunityType.PUBLIC,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const imageIsUploaded = form.getValues().imageUrl !== "";

  const handleOnSubmit = async (values: z.infer<typeof createCommunityFormSchema>) => {
    try {
      const res = await axios.post("/api/communities", values);

      handleModalClose();
      setHeaderActivePlace({ text: res.data.uniqueName, imageUrl: res.data.imageUrl });
      setCommunity(null);
      setCurrentMember(null);
      router.push(`/main/communities/${res.data.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    form.reset();
    closeModal();
  };

  return (
    <Dialog open={modalIsOpen} onOpenChange={handleModalClose}>
      <DialogContent className="dark:bg-[#161718]">
        <DialogHeader>
          <p className="font-semibold text-lg">Create a community</p>
          <Separator />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-5">
            <div>
              <p className={cn("font-semibold text-lg", imageIsUploaded && "hidden")}>Community image</p>
              <div className={cn("mt-2", imageIsUploaded ? "flex gap-x-5 w-full" : "space-y-5")}>
                <div>
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUploader isLoading={isLoading} value={field.value} onChange={field.onChange} text="Upload community image" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <p className="font-semibold text-lg">Names</p>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Display name" className="bg-transparent mt-1" {...field} autoComplete="off" disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="uniqueName"
                    render={({ field }) => (
                      <FormItem>
                        <div className={cn("mt-2", isLoading && "opacity-50")}>
                          <div className="flex items-center rounded-md border border-input bg-white dark:bg-[#272729] focus-within:dark:bg-[#1A1A1B] focus-within:dark:border-white hover:bg-white hover:border-blue-500 focus-within:bg-white focus-within:border-blue-500 hover:dark:bg-[#1A1A1B] hover:dark:border-white border-gray-200 dark:border-[#3c3c3d] text-sm ring-offset-background px-3">
                            <p className="text-zinc-500">r/</p>
                            <FormControl>
                              <Input
                                className="bg-transparent dark:bg-transparent dark:hover:bg-transparent h-full border-none px-1"
                                {...field}
                                autoComplete="off"
                                disabled={isLoading}
                              />
                            </FormControl>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button className="my-2 sm:my-0 sm:mr-2" variant="secondary" onClick={handleModalClose} type="button" disabled={isLoading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                Create community
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
