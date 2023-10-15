import { getExt } from './files';
import { MEDIA_TYPE } from './constant'
import { Command } from "../command/index";
// 页面
export default class Page {
    pageUrl: string
    content: string | Buffer
    contentType: string

    constructor(url: string, content: string | Buffer, is_html = false) {
        this.pageUrl = url
        this.content = content
        this.contentType = getType(url, is_html)
    }
}

export const getType = (url: string, is_html = false) => is_html ? 'text/html;charset=utf-8' : MEDIA_TYPE[`.${getExt(url)}`] || `text/plain;charset=utf-8`



export class LRUCache {
    capacity: number
    cache: Map<string, Page | Command>

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key: string) {
        if (this.cache.has(key)) {
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value as (Page | Command);
        }
        return -1;
    }

    set(key: string, value: Page | Command) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
        this.cache.set(key, value);
    }

    remove(key: string) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
    }
}
