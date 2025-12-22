import {KubernetesObject} from './kubernetes-object.model';

export interface KubernetesList<T extends KubernetesObject> {
  apiVersion: string;
  metadata: {continue: string; resourceVersion: string};
  kind: string;
  items: T[];
}
