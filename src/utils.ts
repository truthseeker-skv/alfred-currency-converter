import axios from 'axios';
import { Window, Document } from 'happy-dom';

export const loadPageDom = async (url: string): Promise<Document> => {
  try {
    const resp = await axios(url);
    const window = new Window();
    window.document.body.innerHTML = resp.data;
    return window.document;
  } catch (err) {
    throw new Error(`Failed to load page dom.\r\n${err.message}`);
  }
}
