import { BaseEntity } from './../../shared';

export const enum ArtifactStatus {
    'PRIVATE',
    'SUBMITED',
    'PUBLISHED'
}

export const enum Resolution {
    'NONE',
    'FIXED',
    'WONTFIX',
    'DUPLICATE',
    'INVALID'
}

export const enum Severity {
    'NONE'
}

export const enum Priority {
    'MINOR',
    'MAJOR',
    'CRITICAL',
    'TRIVIAL',
    'BLOCKER'
}

export class Defect implements BaseEntity {
    constructor(
        public id?: number,
        public ticket?: string,
        public summary?: string,
        public description?: any,
        public status?: ArtifactStatus,
        public resolution?: Resolution,
        public severity?: Severity,
        public priority?: Priority,
        public recorded?: any,
        public modified?: any,
        public author?: string,
        public license?: string,
        public developer?: BaseEntity,
    ) {
    }
}
