"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "~/trpc/react"; // Import the trpc client
import { useUser } from "@clerk/nextjs"; // Import useUser hook from Clerk

const formSchema = z.object({
  gender: z.enum(["Male", "Female"]),
  age: z
    .string()
    .min(1, { message: "Age is required" })
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 120,
      {
        message: "Age must be a number between 1 and 120",
      },
    ),
  height: z
    .string()
    .min(1, { message: "Height is required" })
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 120,
      {
        message: "Height must be a number between 1 and 120 inches",
      },
    ),
  weight: z
    .string()
    .min(1, { message: "Weight is required" })
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 500,
      {
        message: "Weight must be a number between 1 and 500 lbs",
      },
    ),
  activityFactor: z.enum(["1.2", "1.375", "1.55", "1.725", "1.9"]),
  // bodyFatPercentage: z
  //   .string()
  //   .optional()
  //   .refine(
  //     (val) =>
  //       val === undefined ||
  //       val === "" ||
  //       (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100),
  //     {
  //       message: "Body fat percentage must be a number between 0 and 100",
  //     },
  //   ),
});

interface MacroCalculatorProps {
  defaultValues?: {
    gender?: "Male" | "Female" | null;
    age?: string | null;
    height?: string | null;
    weight?: string | null;
    activityFactor?: "1.2" | "1.375" | "1.55" | "1.725" | "1.9" | null;
  };
}

const MacroCalculator: React.FC<MacroCalculatorProps> = ({ defaultValues }) => {
  const router = useRouter();
  const { user } = useUser(); // Get the current user
  const updateUserProfile = api.profile.updateUserProfile.useMutation(); // Get the updateUserProfile mutation

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: defaultValues?.gender ?? "Male",
      age: defaultValues?.age ?? "",
      height: defaultValues?.height ?? "",
      weight: defaultValues?.weight ?? "",
      activityFactor: defaultValues?.activityFactor ?? "1.2",
    },
  });

  const calculateMacros = (values: z.infer<typeof formSchema>) => {
    // Convert string values to numbers
    const age = Number(values.age);
    const height = Number(values.height) * 2.54; // Convert inches to cm
    const weight = Number(values.weight) * 0.453592; // Convert lbs to kg
    const activityFactor = Number(values.activityFactor);

    // Calculate BMR
    let bmr: number;
    if (values.gender === "Male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Calculate TDEE
    const tdee = bmr * activityFactor;

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
    };
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // calculate macros
    const results = calculateMacros(values);

    // if user exists, update the profile
    if (user) {
      try {
        await updateUserProfile.mutateAsync({
          gender: values.gender,
          weight: values.weight,
          height: values.height,
          age: values.age,
          activityFactor: values.activityFactor,
          bmr: results.bmr,
          tdee: results.tdee,
        });
        console.log("User profile updated successfully");
      } catch (error) {
        console.error("Error updating user profile:", error);
      }
    }

    // redirect to results
    router.push(
      `/macros/results?${new URLSearchParams({
        ...values,
        bmr: results.bmr.toString(),
        tdee: results.tdee.toString(),
      }).toString()}`,
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age (yrs)</FormLabel>
                  <FormControl>
                    <Input
                      className="text-base"
                      type="string"
                      placeholder="30"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (in)</FormLabel>
                  <FormControl>
                    <Input
                      className="text-base"
                      type="string"
                      placeholder="74"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (lbs)</FormLabel>
                  <FormControl>
                    <Input
                      className="text-base"
                      type="string"
                      placeholder="195"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activityFactor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1.2">
                        Sedentary (office job)
                      </SelectItem>
                      <SelectItem value="1.375">
                        Light Exercise (1-2x/week)
                      </SelectItem>
                      <SelectItem value="1.55">
                        Moderate Exercise (3-5x/week)
                      </SelectItem>
                      <SelectItem value="1.725">
                        Heavy Exercise (6-7x/week)
                      </SelectItem>
                      <SelectItem value="1.9">Athlete (2x/day)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="bodyFatPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bodyfat (%) - Optional</FormLabel>
                  <FormDescription>
                    This is used to calculate your lean body mass and give a
                    more accurate TDEE. Leave blank if unknown.
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="string"
                      placeholder="12.0"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? undefined : value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
          <div className="flex justify-center pt-8">
            <Button type="submit" className="w-full md:w-auto">
              Calculate Macros
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MacroCalculator;
