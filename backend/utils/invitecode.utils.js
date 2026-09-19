export function InviteCodeGenerator(prefix) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomCode = "";

  for (let i = 0; i < 5; i++) {
    randomCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return `${prefix}${randomCode}`;
}
