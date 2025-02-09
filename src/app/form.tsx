"use client";
import { useState } from "react";
import { z } from "zod";

export default function Formpage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const mySchema = z.object({
        name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
        email: z.coerce.string().email({ message: "Invalid email format" }).min(5),
        hobbies: z.array(z.string().min(2)).min(1, { message: "Hobbies are required" }),
      });

      const response = mySchema.safeParse({ name, email, hobbies });

      if (!response.success) {
        let errArr: any[] = [];
        const { errors: err } = response.error;
        for (var i = 0; i < err.length; i++) {
          errArr.push({ for: err[i].path[0], message: err[i].message });
        }
        setErrors(errArr);
        throw err;
      }

      setErrors([]);
      console.log("Form Submitted Successfully:", { name, email, hobbies });

      // Show success popup
      setSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessPopup = () => {
    setSuccess(false);
  };

  return (
    <main className="flex min-h-screen flex-col p-24">
      <div className="mb-6 flex gap-3 sm:items-center">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Add User
        </h2>
      </div>
      <div className="rounded-sm border">
        <div className="border-b px-6 py-4">
          <h3 className="font-medium text-black dark:text-white">
            User Details
          </h3>
        </div>
        <form className="flex flex-col gap-6 p-10" method="post" onSubmit={onSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Name"
              className="w-full rounded-lg border px-4 py-2 text-black outline-none transition focus:border-blue-500 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setName(e.target.value)}
            />
            {errors.find((err) => err.for === "name") && (
              <p className="text-red-500 text-sm mt-1">
                {errors.find((err) => err.for === "name")?.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Email"
              className="w-full rounded-lg border px-4 py-2 text-black outline-none transition focus:border-blue-500 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.find((err) => err.for === "email") && (
              <p className="text-red-500 text-sm mt-1">
                {errors.find((err) => err.for === "email")?.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Hobbies <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter hobbies separated by commas"
              className="w-full rounded-lg border px-4 py-2 text-black outline-none transition focus:border-blue-500 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setHobbies(e.target.value.split(","))}
            />
            {errors.find((err) => err.for === "hobbies") && (
              <p className="text-red-500 text-sm mt-1">
                {errors.find((err) => err.for === "hobbies")?.message}
              </p>
            )}
          </div>
          <div className="text-end">
            <button
              type="submit"
              className="h-10 w-32 rounded-md bg-blue-600 font-medium text-white disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Popup */}
      {success && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md text-center">
            <p className="text-green-500 text-lg font-semibold mb-4">
              Data Successfully Saved!
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={closeSuccessPopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}