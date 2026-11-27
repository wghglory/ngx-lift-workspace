import {untracked} from '@angular/core';
import {
  getActiveConsumer,
  producerAccessed,
  producerUpdateValueVersion,
  ReactiveNode,
} from '@angular/core/primitives/signals';

/** Internal bridge to Angular's signal primitives; never invokes a factory to inspect its dependencies. */
export class ResourceSourceDependencies {
  private producers: ReactiveNode[] = [];
  private snapshot: {producers: ReactiveNode[]; versions: number[]} | undefined;
  private disposed = false;

  capture<T>(factory: () => T): T {
    const consumer = getActiveConsumer();
    if (!consumer || this.disposed) return factory();
    const producers: ReactiveNode[] = [];
    const seen = new Set<ReactiveNode>();
    this.producers = producers;
    const onRead = consumer.consumerOnSignalRead;
    consumer.consumerOnSignalRead = (producer) => {
      onRead.call(consumer, producer);
      if (this.disposed) return;
      const dependency = producer as ReactiveNode;
      if (seen.has(dependency)) return;
      seen.add(dependency);
      producers.push(dependency);
      // A factory may set/reset its resource before it finishes reading dependencies.
      if (this.snapshot?.producers === producers) this.snapshot.versions.push(dependency.version);
    };
    try {
      return factory();
    } finally {
      consumer.consumerOnSignalRead = onRead;
    }
  }

  suppress(): void {
    const producers = this.producers;
    this.snapshot = {producers, versions: this.versions(producers)};
  }

  resume(): void {
    this.snapshot = undefined;
  }

  destroy(): void {
    this.disposed = true;
    this.producers = [];
    this.snapshot = undefined;
  }

  isSuppressed(): boolean {
    const snapshot = this.snapshot;
    this.snapshot = undefined;
    if (!snapshot) return false;
    // Refresh every producer, including computed signals after an earlier changed dependency.
    const versions = this.versions(snapshot.producers);
    if (versions.some((version, index) => version !== snapshot.versions[index])) return false;
    // A skipped effect must retain its dependencies without rerunning eager factory work.
    for (const producer of snapshot.producers) producerAccessed(producer);
    return true;
  }

  private versions(producers: readonly ReactiveNode[]): number[] {
    return untracked(() =>
      producers.map((producer) => {
        producerUpdateValueVersion(producer);
        return producer.version;
      }),
    );
  }
}
