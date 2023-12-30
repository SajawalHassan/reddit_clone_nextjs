"use client";

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

import { Eye, Lock, User2 } from "lucide-react";
import { CommunityType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FileUploader } from "@/components/file-uploader";
import React, { useEffect } from "react";
import { useCommunityInfo } from "@/hooks/use-community-info";

export const EditCommunityModal = () => {
  const { community, setCommunity } = useCommunityInfo();
  const { isOpen, type, closeModal } = useModal();

  const modalIsOpen = isOpen && type === "editCommunity";
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createCommunityFormSchema),
    defaultValues: {
      name: "",
      uniqueName: "",
      imageUrl: "",
      type: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (community) {
      form.setValue("name", community.name);
      form.setValue("uniqueName", community.uniqueName);
      form.setValue("imageUrl", community.imageUrl);
      form.setValue("type", community.type);
    }
  }, [community]);

  const handleOnSubmit = async (values: any) => {
    try {
      await axios.patch("/api/communities", { communityId: community?.id, data: values });

      setCommunity({ ...community!, name: values.name, imageUrl: values.imageUrl, type: values.type as CommunityType });
      handleModalClose();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    if (community) {
      form.setValue("name", community.name);
      form.setValue("uniqueName", community.uniqueName);
      form.setValue("imageUrl", community.imageUrl);
      form.setValue("type", community.type);
    }
    closeModal();
  };

  return (
    <Dialog open={modalIsOpen} onOpenChange={handleModalClose}>
      <DialogContent className="dark:bg-[#161718]">
        <DialogHeader>
          <p className="font-semibold text-lg">Edit r/{community?.uniqueName}</p>
          <Separator />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-5">
            <div>
              <div className={cn("mt-2 flex gap-x-5 w-full")}>
                <div>
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUploader
                            isLoading={isLoading}
                            value={field.value}
                            onChange={field.onChange}
                            text="Upload community image"
                            canBeNull={false}
                            loadingContent={
                              <div className={cn("relative h-20 w-20", isLoading && "image-overlay-wrapper")}>
                                <div className="rounded-full bg-gray-500 h-full w-full animate-pulse" />
                              </div>
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <p className="font-semibold text-lg">Name</p>
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
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button className="my-2 sm:my-0 sm:mr-2" variant="secondary" onClick={handleModalClose} type="button" disabled={isLoading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                Edit community
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
