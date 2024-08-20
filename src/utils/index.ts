export function wait(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

export function slugify(str: string) {
  return str
    .toString() // Ensure the input is a string
    .toLowerCase() // Convert to lowercase
    .trim() // Remove whitespace from both ends
    .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word characters with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading or trailing hyphens
}
