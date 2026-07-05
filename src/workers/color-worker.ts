import { extractColorsFromImageData, type WorkerResult } from "../lib/extraction";

self.onmessage = (e: MessageEvent<ImageData>) => {
  const result = extractColorsFromImageData(e.data);
  self.postMessage(result);
};
