import { BaseEntity } from './../../shared';

export const enum ArtifactStatus {
    'PRIVATE',
    'SUBMITED',
    'PUBLISHED'
}

export class Script implements BaseEntity {
    constructor(
        public id?: number,
        public tag?: string,
        public description?: string,
        public sourceCode?: string,
        public status?: ArtifactStatus,
        public author?: string,
        public license?: string,
        public study?: BaseEntity,
    ) {
    }
}
