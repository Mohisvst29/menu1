import fs from 'fs';
import path from 'path';
import type { SiteConfig, ItemsData, AdminConfig } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

function readJSON<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

function writeJSON(filename: string, data: unknown): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function getSiteConfig(): SiteConfig {
  return readJSON<SiteConfig>('site.json');
}

export function saveSiteConfig(config: SiteConfig): void {
  writeJSON('site.json', config);
}

export function getItemsData(): ItemsData {
  return readJSON<ItemsData>('items.json');
}

export function saveItemsData(data: ItemsData): void {
  writeJSON('items.json', data);
}

export function getAdminConfig(): AdminConfig {
  return readJSON<AdminConfig>('admin.json');
}

export function saveAdminConfig(config: AdminConfig): void {
  writeJSON('admin.json', config);
}
