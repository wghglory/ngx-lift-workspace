import {Injectable} from '@angular/core';

export interface DatabaseDetails {
  name: string;
  engine: string;
  cpu: string;
  ram: string;
}

@Injectable({providedIn: 'root'})
export class DatabaseService {
  async getDatabase(id: string): Promise<DatabaseDetails> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const databases: Record<string, DatabaseDetails> = {
      'db-pg-01': {name: 'Production PostgreSQL', engine: 'PostgreSQL 16.2', cpu: '8 vCPU', ram: '32 GB'},
      'db-ch-02': {name: 'Analytics ClickHouse', engine: 'ClickHouse 24.1', cpu: '16 vCPU', ram: '64 GB'},
      'db-rd-03': {name: 'Session Cache Redis', engine: 'Redis 7.2 Cluster', cpu: '4 vCPU', ram: '16 GB'},
    };
    return databases[id] ?? {name: id, engine: 'Generic Engine', cpu: '2 vCPU', ram: '8 GB'};
  }
}
