// png-size.mjs — baca dimensi PNG dari header IHDR tanpa dependensi.
// Dipakai check-static.mjs untuk menegakkan og-image.png 1200x630.
import { readFileSync, statSync } from 'node:fs';

export const PNG = {
  read(path) {
    const buf = readFileSync(path);
    if (buf.length < 33 || buf.toString('ascii', 1, 4) !== 'PNG') {
      throw new Error(`${path} bukan berkas PNG`);
    }
    return {
      width: buf.readUInt32BE(16),
      height: buf.readUInt32BE(20),
      size: statSync(path).size,
    };
  },
};
