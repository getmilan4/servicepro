
"use client";

import { useActionState } from "react";
import { createUser, type ActionState } from "./actions";

const initialState: ActionState = {
  success: false,
  message: "",
};

export default function CreateUserForm() {
  const [state, formAction, pending] = useActionState(
    createUser,
    initialState
  );

  return (
    <section className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black bg-white">
      <h2 className="text-lg font-semibold text-slate-800 mb-5">
        Add New User
      </h2>

      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              maxLength={50}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              maxLength={255}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temporary Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              required
              defaultValue="EMPLOYEE"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="ADMIN">Admin</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="PARTNER">Partner</option>
              <option value="POS">POS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Status
            </label>
            <select
              name="status"
              defaultValue="INACTIVE"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="INACTIVE">Inactive</option>
              <option value="ACTIVE">Active</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
        >
          {pending ? "Creating..." : "Create User"}
        </button>

        {state.message && (
          <p
            role="status"
            className={`text-sm font-medium ${
              state.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {state.message}
          </p>
        )}
      </form>
    </section>
  );
}
