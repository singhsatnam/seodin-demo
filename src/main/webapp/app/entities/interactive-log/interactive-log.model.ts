import { BaseEntity } from './../../shared';

export const enum LogKind {
    'SELECTION',
    'COMMAND',
    'PREFERENCE',
    'EDIT'
}

export const enum ArtifactStatus {
    'PRIVATE',
    'SUBMITED',
    'PUBLISHED'
}

export class InteractiveLog implements BaseEntity {
    constructor(
        public id?: number,
        public kind?: LogKind,
        public sourceHandle?: string,
        public origin?: string,
        public delta?: string,
        public recorded?: any,
        public status?: ArtifactStatus,
        public author?: string,
        public license?: string,
        public developer?: BaseEntity,
    ) {
    }
}
