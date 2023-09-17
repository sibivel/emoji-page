
export async function time<T>(label: string, expression: () => Promise<T>): Promise<T> {
  console.time(label); // Start the timer
  const result = await expression();
  console.timeEnd(label); // End the timer and log the time
  
  return result;
}
export function timeSync<T>(label: string, expression: () => T): T {
  console.time(label); // Start the timer
  const result = expression();
  console.timeEnd(label); // End the timer and log the time
  
  return result;
}