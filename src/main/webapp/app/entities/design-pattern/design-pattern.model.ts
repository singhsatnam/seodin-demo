import { BaseEntity } from './../../shared';

export const enum ArtifactStatus {
    'PRIVATE',
    'SUBMITED',
    'PUBLISHED'
}

export class DesignPattern implements BaseEntity {
    constructor(
        public id?: number,
        public tag?: string,
        public author?: string,
        public xmlDescriptor?: string,
        public status?: ArtifactStatus,
        public license?: string,
        public sourceCode?: BaseEntity,
    ) {
    }
}
