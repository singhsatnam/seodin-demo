import { BaseEntity } from './../../shared';

export const enum ArtifactStatus {
    'PRIVATE',
    'SUBMITED',
    'PUBLISHED'
}

export class Diary implements BaseEntity {
    constructor(
        public id?: number,
        public uri?: string,
        public status?: ArtifactStatus,
        public author?: string,
        public license?: string,
        public softwareSystem?: BaseEntity,
        public task?: BaseEntity,
        public developer?: BaseEntity,
    ) {
    }
}
