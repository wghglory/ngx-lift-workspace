import {Injectable, signal} from '@angular/core';

interface ServerMetrics {
  activeUsers: number;
  cpuLoad: number;
  memoryUsage: number;
  timestamp: string;
}

@Injectable()
export class MetricsService {
  readonly readCount = signal(0);

  async getMetrics(): Promise<ServerMetrics> {
    this.readCount.update((count) => count + 1);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      activeUsers: 142 + Math.floor(Math.random() * 20),
      cpuLoad: Math.floor(35 + Math.random() * 25),
      memoryUsage: Math.floor(60 + Math.random() * 15),
      timestamp: new Date().toLocaleTimeString(),
    };
  }
}
