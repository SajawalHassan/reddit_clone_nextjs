"use client";

import * as z from "zod";
import axios from "axios";

import { useModal } from "@/hooks/use-modal-store";
import { useForm } from "react-hook-form";

import { Separator } from "@/components/ui/seperator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { CommunityTypeButton } from "@/components/community-type-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createCommunityFormSchema } from "@/schemas/community-schema";

import { Eye, Lock, User2 } from "lucide-react";
import { CommunityType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FileUploader } from "../file-uploader";

export const CreateCommunityModal = () => {
  const { isOpen, type, closeModal } = useModal();

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
      await axios.post("/api/communities", values);

      handleModalClose();
      router.refresh();
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
                      <FormControl>
                        <FileUploader isLoading={isLoading} value={field.value} onChange={field.onChange} />
                      </FormControl>
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
                        <div className={cn("border border-input rounded-md mt-2 py-0 px-2", isLoading && "opacity-50")}>
                          <div className="flex items-center">
                            <p className="text-zinc-500">r/</p>
                            <FormControl>
                              <Input className="bg-transparent h-full border-none px-1" {...field} autoComplete="off" disabled={isLoading} />
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

            <div>
              <p className="font-semibold text-lg">Community Type</p>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <div className="flex w-full items-center gap-x-2 mt-2">
                    <FormItem className="w-full">
                      <FormControl>
                        <CommunityTypeButton
                          Icon={User2}
                          text="Public"
                          tooltipContent="Anyone can view, post, and comment to this community"
                          isSelected={field.value === "PUBLIC"}
                          onChange={() => field.onChange(CommunityType.PUBLIC.toString())}
                          value={field.value}
                          isLoading={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem className="w-full">
                      <FormControl>
                        <CommunityTypeButton
                          Icon={Eye}
                          text="Restricted"
                          tooltipContent="Anyone can view this community, but only approved users can post"
                          isSelected={(field.value as string) === "RESTRICTED"}
                          onChange={() => field.onChange(CommunityType.RESTRICTED.toString())}
                          value={field.value}
                          isLoading={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem className="w-full">
                      <FormControl>
                        <CommunityTypeButton
                          Icon={Lock}
                          text="Private"
                          tooltipContent="Only approved users can view and submit to this community"
                          isSelected={(field.value as string) === "PRIVATE"}
                          onChange={() => field.onChange(CommunityType.PRIVATE.toString())}
                          value={field.value}
                          isLoading={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                )}
              />
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
