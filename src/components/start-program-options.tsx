// StartProgram.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Icons } from "@/components/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface Program {
  title: string;
  length: string;
  createdAt: Date;
  description: string;
  programId: number;
  active: boolean;
  options: boolean;
  parentId: number | null;
}

interface SubmitProgramProps {
  programId: number;
  name: string;
  childPrograms?: Program[];
}

const formSchema = z.object({
  childProgramId: z.string(),
});

export function StartProgramOptions({
  programId,
  name,
  childPrograms,
}: SubmitProgramProps) {
  const router = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const mutation = api.wod.startProgram.useMutation({
    onSuccess: () => {
      toast.success("Program Started");
      setIsSubmitLoading(false);
      setOpen(false);
      router.refresh();
    },
    onError: (e) => {
      const errorCode = e.data?.code;
      if (errorCode === "TOO_MANY_REQUESTS") {
        toast.error("Rate limit reached. Try again in 1 minute.");
      } else {
        toast.error("Error, Something went wrong.");
      }
      setIsSubmitLoading(false);
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitLoading(true);
    mutation.mutate({ programId: parseInt(values.childProgramId) });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button disabled={isSubmitLoading} size="sm" variant="acid">
          <div>
            {isSubmitLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span>Start Program</span>
            )}
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Select Program Variation</AlertDialogTitle>
          {/* <AlertDialogDescription>
            Select the options for your program
          </AlertDialogDescription> */}
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="childProgramId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Variation</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program variation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {childPrograms?.map((program) => (
                        <SelectItem
                          key={program.programId}
                          value={program.programId.toString()}
                        >
                          {program.title} ({program.length})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isSubmitLoading || !form.formState.isValid}
            onClick={form.handleSubmit(handleSubmit)}
          >
            <span>Submit</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
