"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, FieldError } from "react-hook-form";
import { Image, Link, Loader2, Menu, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";

import dynamic from "next/dynamic";
import * as z from "zod";

import "froala-editor/css/froala_editor.pkgd.css";
import { useSearchParams } from "next/navigation";
import { PostTypeItem } from "./post-type-item";
import { FileUploader } from "@/components/file-uploader";
import { IconButton } from "@/components/icon-button";
import { Button } from "@/components/ui/button";
import { CommunitySelecter } from "./community-selecter";
import { Community } from "@prisma/client";
import { PostTagItem } from "./post-tag-item";

const FroalaEditor = dynamic(
  async () => {
    const values = await Promise.all([import("react-froala-wysiwyg")]);
    return values[0];
  },
  {
    loading: () => (
      <div className="flex items-center justify-center w-full mt-5">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    ),
    ssr: false,
  }
);

const isCommunity = z.custom<any>();

const plainFormSchema = z.object({
  title: z.string().min(1, "Please enter a title!").max(300, "Max characters for title exceeded!"),
  community: isCommunity,
  isSpoiler: z.boolean(),
  foralaContent: z.string(),
  imageUrl: z.string(),
  link: z.string(),
});

const mediaFormSchema = z.object({
  title: z.string().min(1, "Please enter a title!").max(300, "Max characters for title exceeded!"),
  community: isCommunity,
  isSpoiler: z.boolean(),
  foralaContent: z.string(),
  imageUrl: z.string().min(1, "Please submit an image"),
  link: z.string(),
});

const linkFormSchema = z.object({
  title: z.string().min(1, "Please enter a title!").max(300, "Max characters for title exceeded!"),
  community: isCommunity,
  isSpoiler: z.boolean(),
  foralaContent: z.string(),
  imageUrl: z.string(),
  link: z.string().min(1, "Please enter a link").url("Invalid url"),
});

export const CreatePostForm = () => {
  const [isMounted, setIsMounted] = useState(false);

  const searchParams = useSearchParams();
  const isMedia = searchParams?.get("media") ? true : false;
  const isLink = searchParams?.get("link") ? true : false;
  const isPlain = searchParams?.get("plain") ? true : false;
  const formSchema = isMedia ? mediaFormSchema : isLink ? linkFormSchema : plainFormSchema;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", foralaContent: "", imageUrl: "", link: "", community: {}, isSpoiler: false },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isPlain) {
      values.imageUrl = "";
      values.link = "";
    } else if (isMedia) {
      values.foralaContent = "";
      values.link = "";
    } else {
      values.foralaContent = "";
      values.imageUrl = "";
    }

    console.log(values);
  };

  if (!isMounted) return;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="community"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CommunitySelecter value={field.value} setValue={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="bg-white dark:bg-[#1A1A1B] border pb-2 rounded-md mt-2 space-y-2">
          <div className="grid grid-cols-3 overflow-x-scroll">
            <PostTypeItem Icon={Menu} text="Post" type="plain" isActive={isPlain} />
            <PostTypeItem Icon={Image} text="Media & Video" type="media" isActive={isMedia} />
            <PostTypeItem Icon={Link} text="Link" type="link" isActive={isLink} />
          </div>
          <div className="px-2 space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter a title" className="bg-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isPlain && (
              <FormField
                control={form.control}
                name="foralaContent"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FroalaEditor model={field.value} onModelChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}{" "}
            {isMedia && (
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUploader
                        isLoading={isLoading}
                        onChange={field.onChange}
                        value={field.value}
                        text="Upload image"
                        imageAvailableContent={
                          <div className="border flex flex-col items-end">
                            <div className="w-full relative overflow-hidden rounded-md">
                              <img className="w-full h-full max-h-[10rem] blur-[20px] brightness-75" src={field.value} />
                              <img className="w-[10rem] h-full max-h-[10rem] absolute inset-0 m-auto" src={field.value} />
                            </div>
                            <IconButton Icon={Trash} onClick={() => field.onChange("")} className="m-2" />
                          </div>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}{" "}
            {isLink && (
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Url" className="bg-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="ml-2">
            <FormField
              control={form.control}
              name="isSpoiler"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PostTagItem text="Spoiler" isActive={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-end px-2">
            <Button variant="primary" type="submit" disabled={isLoading}>
              Create post
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
