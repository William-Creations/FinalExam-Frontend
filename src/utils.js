// Landing page for each role.
export function homeFor(user) {
  if (!user) return "/login";
  return user.role === "Teacher" ? "/teacher" : "/courses";
}
