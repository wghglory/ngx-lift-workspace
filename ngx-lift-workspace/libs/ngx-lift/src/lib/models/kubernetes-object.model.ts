/* eslint-disable @typescript-eslint/no-explicit-any */
import {KubernetesObjectMetaV1} from './kubernetes-object-meta.model';

export interface KubernetesObject {
  apiVersion: string;
  kind: string;
  metadata: KubernetesObjectMetaV1;
  spec?: any;
  status?: any;
}
