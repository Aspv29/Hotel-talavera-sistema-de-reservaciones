import JSZip from "jszip";

export const zipFiles = async (
  files: { name: string; content: string | Blob }[]
) => {
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.name, file.content);
  }

  const content = await zip.generateAsync({ type: "blob" });
  return content;
};