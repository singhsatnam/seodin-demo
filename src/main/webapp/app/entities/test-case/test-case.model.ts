import { BaseEntity } from './../../shared';

export const enum ArtifactStatus {
    'PRIVATE',
    'SUBMITED',
    'PUBLISHED'
}

export class TestCase implements BaseEntity {
    constructor(
        public id?: number,
        public tag?: string,
        public uri?: string,
        public status?: ArtifactStatus,
        public author?: string,
        public license?: string,
        public softwareSystem?: BaseEntity,
        public developer?: BaseEntity,
    ) {
    }
}
