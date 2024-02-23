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
