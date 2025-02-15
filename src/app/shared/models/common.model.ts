export interface Unique<T extends PropertyKey = string> {
  id: T;
}

export enum EntityMutation {
  Edit = 'edit',
  Delete = 'delete',
}

export enum EntityOperation {
  Delete = 'delete',
  Add = 'add',
  Edit = 'edit',
}

export type PermissionMap<T extends string> = Record<T, () => boolean>;

export abstract class DynamicOptionsMenu<T> {
  abstract isActionAvailable(action: T): boolean;
}
