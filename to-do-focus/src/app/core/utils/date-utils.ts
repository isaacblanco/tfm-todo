/**
 * Formatea una fecha en el formato 'DD-MMM-AAAA HH:MM'
 * @param dateString - Fecha a formatear
 * @returns Fecha formateada como cadena
 */
export function formatDateTime(dateString: Date | string): string {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return date.toLocaleString('es-ES', options).replace(',', ''); // 'es-ES' para formato en español
}
