import { Role } from "@prisma/client";

export async function getCurrentUser() {
  // STUDENT mock
  return {
    id: "45d6f3e7-4183-4367-a258-7c5c417f9826",
    role: Role.STUDENT,
    name: "Chiamaka Okafor",
    email: "student@caspaa.com",
    password: "password123",
  };

  // TEACHER mock
  // return {
  //   id: "PASTE_UUID_HERE",
  //   role: Role.TEACHER,
  //   name: "Mock Teacher",
  // };
}
