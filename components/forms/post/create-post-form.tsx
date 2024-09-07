"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Image, Link, Menu, Trash } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import { Input } from "@/components/ui/input";

import axios from "axios";
import * as z from "zod";

import { useRouter, useSearchParams } from "next/navigation";
import { PostTypeItem } from "./post-type-item";
import { FileUploader } from "@/components/file-uploader";
import { IconButton } from "@/components/icon-button";
import { Button } from "@/components/ui/button";
import { CommunitySelecter } from "@/components/community/community-selecter";
import { PostTagItem } from "./post-tag-item";
import { linkFormSchema, mediaFormSchema, plainFormSchema } from "@/schemas/post-schema";
import { useGlobalInfo } from "@/hooks/use-global-info";

export const CreatePostForm = () => {
  const [isMounted, setIsMounted] = useState(false);

  const searchParams = useSearchParams();
  const isMedia = searchParams?.get("media") ? true : false;
  const isLink = searchParams?.get("link") ? true : false;
  const isPlain = searchParams?.get("plain") ? true : false;
  const preSelectedCommunityId = searchParams?.get("preselected") ? (searchParams?.get("preselected") as string) : "";
  const formSchema = isMedia ? mediaFormSchema : isLink ? linkFormSchema : plainFormSchema;

  const router = useRouter();
  const { setHeaderActivePlace } = useGlobalInfo();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", postContent: "", imageUrl: "", link: "", communityId: "", isSpoiler: false },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    setIsMounted(true);

    setHeaderActivePlace({ text: "Create Post", icon: "Plus" });
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isPlain) {
      values.imageUrl = "";
      values.link = "";
    } else if (isMedia) {
      values.postContent = "";
      values.link = "";
    } else {
      values.postContent = "";
      values.imageUrl = "";
    }

    try {
      const response = await axios.post("/api/posts", { ...values, type: isPlain ? "plain" : isMedia ? "media" : "link" });
      const post = response.data;

      form.reset();
      setHeaderActivePlace({ text: post.community.uniqueName, imageUrl: post.community.imageUrl });
      router.push(`/main/communities/${post.community.id}/post/${post.post.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isMounted) return;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="communityId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CommunitySelecter value={field.value} setValue={field.onChange} preSelectedCommunityId={preSelectedCommunityId} />
              </FormControl>
              <FormMessage />
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
                    <Input placeholder="Enter a title" className="bg-white" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isPlain && (
              <FormField
                control={form.control}
                name="postContent"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                        value={field.value}
                        onEditorChange={field.onChange}
                        initialValue=""
                        init={{
                          height: 200,
                          menubar: false,
                          plugins: ["advlist", "autolink", "lists", "link", "image", "charmap", "preview", "anchor", "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media", "table", "code", "help", "wordcount"],
                          toolbar: "undo redo | blocks | " + "bold italic forecolor | alignleft aligncenter " + "alignright alignjustify | bullist numlist outdent indent | " + "removeformat | help",
                          content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                        }}
                      />
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
                          <div className="border flex flex-col items-end rounded-md">
                            <div className="w-full relative overflow-hidden rounded-t-md">
                              <img className="w-full max-h-[512px] blur-[20px] brightness-75" src={field.value} />
                              <img className="max-w-full max-h-[512px] absolute inset-0 m-auto" src={field.value} />
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
                      <Input placeholder="Url" className="bg-white" {...field} disabled={isLoading} />
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
                    <PostTagItem text="Spoiler" isActive={field.value} onChange={field.onChange} disabled={isLoading} />
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
