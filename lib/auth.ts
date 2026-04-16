export const USER = {
  username: "admin",
  password: "1234",
};

export function validateUser(username: string, password: string) {
  return username === USER.username && password === USER.password;
}


