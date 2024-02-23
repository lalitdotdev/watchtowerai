import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(d: Date) {
  const formattedDate =
    [(d.getMonth() + 1).toString().padStart(2, '0'), d.getDate().toString().padStart(2, '0'), d.getFullYear()].join(
      '-',
    ) +
    ' ' +
    [
      d.getHours().toString().padStart(2, '0'),
      d.getMinutes().toString().padStart(2, '0'),
      d.getSeconds().toString().padStart(2, '0'),
    ].join('-');
  return formattedDate;
}

export function base64toBlob(base64Data: any) {
  const byteCharacters = atob(base64Data.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteCharacters.length);
  const byteArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: 'image/png' }); // Specify the image type here
}
