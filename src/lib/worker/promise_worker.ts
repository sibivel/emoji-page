
import MyWorker from '$lib/worker/worker?worker';
export async function runAsync<T>(f: () => T): Promise<T> {
  console.log(f.toString());
  const worker = new MyWorker;
  return new Promise((resolve) => {
    worker.postMessage(JSONfn.stringify(f));
    worker.onmessage = (e) => {
      resolve(e.data);
    };
  });
}
