"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile } from "@prisma/client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/seperator";
import { Input } from "@/components/ui/input";
import TextareaAutosize from "react-textarea-autosize";
import { FileUploader, uploadFile } from "../file-uploader";
import { Camera, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "../icon-button";
import axios from "axios";
import { useGlobalInfo } from "@/hooks/use-global-info";
import { Button } from "../ui/button";
import { useProfileInfo } from "@/hooks/use-profile-info";

const formSchema = z.object({
  displayName: z.string().min(1, "Please enter a name!"),
  about: z.string(),
  imageUrl: z.string().min(1, "Please submit an image!"),
  bannerUrl: z.string(),
});

export const UserSettingsForm = ({ profile }: { profile: Profile }) => {
  const [isSubmittingProfilePic, setIsSubmittingProfilePic] = useState(false);
  const [isSubmittingBanner, setIsSubmittingBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setViewingProfile, setProfile: setCurrentProfile, profile: currentProfile } = useProfileInfo();
  const { setHeaderActivePlace, headerActivePlace } = useGlobalInfo();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      about: "",
      imageUrl: "",
      bannerUrl: "",
    },
  });

  const profilePicUploadRef = useRef<any>(null);
  const canSaveInfo = form.getValues().displayName !== profile.displayName || form.getValues().about !== (profile.about || "");

  useEffect(() => {
    if (currentProfile) {
      form.setValue("displayName", currentProfile.displayName);
      form.setValue("about", currentProfile.about || "");
      form.setValue("imageUrl", currentProfile.imageUrl);
      form.setValue("bannerUrl", currentProfile.bannerUrl || "");
    } else {
      form.setValue("displayName", profile.displayName);
      form.setValue("about", profile.about || "");
      form.setValue("imageUrl", profile.imageUrl);
      form.setValue("bannerUrl", profile.bannerUrl || "");
    }
  }, [currentProfile]);

  const uploadProfilePic = (e: ChangeEvent) => {
    const file = (e.target as HTMLInputElement).files![0];
    if (!file) return;

    uploadFile(file, setIsSubmittingProfilePic, async (url) => {
      try {
        await axios.patch("/api/profile", { data: { imageUrl: url } });
        form.setValue("imageUrl", url);

        setViewingProfile(null);
        setCurrentProfile({ ...currentProfile!, imageUrl: url });
        setHeaderActivePlace({ ...headerActivePlace, imageUrl: url });
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmittingProfilePic(false);
      }
    });
  };

  const uploadBanner = async (url: string) => {
    try {
      await axios.patch("/api/profile", { data: { bannerUrl: url } });
      form.setValue("bannerUrl", url);

      setViewingProfile(null);
      setCurrentProfile({ ...currentProfile!, bannerUrl: url });
    } catch (error) {
      console.log(error);
    }
  };

  const removeBanner = async () => {
    try {
      setIsSubmittingBanner(true);

      form.setValue("bannerUrl", "");
      await axios.patch("/api/profile", { data: { bannerUrl: "" } });

      setViewingProfile(null);
      setCurrentProfile({ ...currentProfile!, bannerUrl: "" });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmittingBanner(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      await axios.patch("/api/profile", { data: values });

      setViewingProfile(null);
      setCurrentProfile({ ...currentProfile!, ...values });
      setHeaderActivePlace({ ...headerActivePlace, text: values.displayName });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full sm:w-[80%] lg:w-[60%] px-6 xl:pl-[20rem]">
        <p className="font-semibold text-xl">Customise your profile</p>
        <div className="space-y-8">
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Profile information</p>
              <Separator className="mt-1" />
            </div>

            <div>
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <div>
                        <FormLabel className="text-lg font-semibold">Display Name</FormLabel>
                        <p className="text-xs font-semibold text-gray-500">Your username</p>
                      </div>
                      <FormControl>
                        <Input {...field} className="bg-transparent" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <div>
                        <FormLabel className="text-lg font-semibold">About (optional)</FormLabel>
                        <p className="text-xs font-semibold text-gray-500">A brief description of yourself shown on your profile.</p>
                      </div>
                      <FormControl>
                        <TextareaAutosize
                          {...field}
                          placeholder="About (optional)"
                          className="w-full p-2 resize-none border border-input hover:border-blue-500 focus:border-blue-500 outline-none rounded-sm dark:bg-[#272729] dark:hover:bg-[#1A1A1B] dark:focus:bg-[#1A1A1B]"
                          minRows={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button variant="primary" className="mt-2" type="submit" disabled={!canSaveInfo || isLoading}>
                  Save information
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Images</p>
              <Separator className="mt-1" />
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-lg font-semibold">Avatar and banner image</p>
                <p className="text-xs font-semibold text-gray-500">Your banner will be shown on your profile</p>
              </div>

              <div className="flex gap-x-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUploader
                          value={field.value}
                          onChange={field.onChange}
                          isLoading={isSubmittingProfilePic}
                          text="Upload profile picture"
                          imageAvailableContent={
                            <div className="relative w-max">
                              <img src={field.value} alt={profile.displayName} className="h-[8rem] w-[8rem] rounded-sm" />
                              <IconButton
                                Icon={isSubmittingProfilePic ? Loader2 : Camera}
                                IconClassName={cn("text-blue-500 h-5 w-5", isSubmittingProfilePic && "animate-spin")}
                                className="absolute bottom-2 right-2 bg-white dark:hover:bg-gray-300"
                                onClick={() => profilePicUploadRef?.current?.click()}
                                disabled={isSubmittingProfilePic}
                              />
                            </div>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bannerUrl"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <FileUploader
                          value={field.value}
                          onChange={(url) => uploadBanner(url)}
                          text="Upload banner image"
                          isLoading={isSubmittingBanner}
                          className="w-full h-[8rem]"
                          imageAvailableContent={
                            <div className="max-h-[8rem] overflow-hidden rounded-sm relative">
                              <img src={field.value} alt={profile.displayName} className="w-full" />
                              <IconButton
                                Icon={isSubmittingBanner ? Loader2 : X}
                                IconClassName={cn("text-white h-5 w-5", isSubmittingBanner && "animate-spin")}
                                className="absolute bottom-2 right-2 bg-red-400 hover:bg-red-600 dark:hover:bg-red-600"
                                onClick={removeBanner}
                                disabled={isSubmittingBanner}
                              />
                            </div>
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <input type="file" ref={profilePicUploadRef} onChange={(e) => uploadProfilePic(e)} className="hidden" accept="image/*" />
      {/* <input type="file" ref={bannerUploadRef} onChange={(e) => uploadBanner(e)} className="hidden" accept="image/*" /> */}
    </Form>
  );
};
