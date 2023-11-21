"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

import dynamic from "next/dynamic";
import * as z from "zod";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/themes/gray.min.css";
import "froala-editor/css/themes/dark.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

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

const formSchema = z.object({
  title: z.string().min(1, "Please enter a title!").max(300, "Max characters for title exceeded!"),
  foralaContent: z.string(),
  imageUrl: z.string(),
  link: z.string(),
});

export const CreatePostForm = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({ resolver: zodResolver(formSchema), defaultValues: { title: "", foralaContent: "", imageUrl: "", link: "" } });

  if (!isMounted) return;

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Enter a title" className="bg-white my-2" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="foralaContent"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FroalaEditor model={field.value} onModelChange={field.onChange} config={{ theme: "gray" }} />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
};
