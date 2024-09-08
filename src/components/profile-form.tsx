"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import React from "react";

import { Switch } from "./ui/switch";
import { formatCityInput } from "~/lib/helpers";

const formSchema = z.object({
  instagram: z.string().min(1).max(50),
  city: z.string().min(1).max(50),
  state: z.string().min(1).max(50),
  goal: z.string().min(1).max(50),
  isPublic: z.boolean(),
});

interface ProfileFormProps {
  action: "create" | "edit";
  profile?: {
    instagram: string;
    city: string;
    state: string;
    goal: string;
    isPublic: boolean;
  };
}

export function ProfileForm({ action, profile }: ProfileFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instagram: profile?.instagram ?? "",
      city: profile?.city ?? "",
      state: profile?.state ?? "",
      goal: profile?.goal ?? "",
      isPublic: profile?.isPublic ?? false,
    },
  });

  // update or insert user profile
  const updateProfile = api.profile.upsertUserProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      setOpen(false);
      // form.reset();
      router.refresh();
      setIsSubmitLoading(false);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
      setIsSubmitLoading(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitLoading(true);
    updateProfile.mutate({
      instagram: values.instagram,
      city: formatCityInput(values.city),
      state: values.state,
      goal: values.goal,
      isPublic: values.isPublic,
    });
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            form.reset();
            setIsSubmitLoading(false);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button>
            {action === "create" ? "Create Profile" : "Edit Profile"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Enter details here. Click submit when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram Handle</FormLabel>
                    <FormDescription>Don&apos;t add @ symbol</FormDescription>
                    <FormControl>
                      <Input placeholder="brucewayne" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormDescription>
                      Please spell it correclty. Capitalization doesn&apos;t
                      matter.
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Fayetteville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="General Health">
                          General Health
                        </SelectItem>
                        <SelectItem value="Mil Prep">Mil Prep</SelectItem>
                        <SelectItem value="Speed">Speed</SelectItem>
                        <SelectItem value="Endurance">Endurance</SelectItem>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Functional">Functional</SelectItem>
                        <SelectItem value="Shred Zone">
                          Shred Zone / Weight Loss
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Public Profile</FormLabel>
                      <FormDescription>
                        Default is private. Click the switch to make it public.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Public Profile
                      </FormLabel>
                      <FormDescription>Default is private.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              /> */}
              <DialogFooter>
                <Button type="submit" disabled={isSubmitLoading}>
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "District of Columbia",
];
