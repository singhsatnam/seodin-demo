import { BaseEntity } from './../../shared';

export const enum ArtifactStatus {
    'PRIVATE',
    'SUBMITED',
    'PUBLISHED'
}

export class Note implements BaseEntity {
    constructor(
        public id?: number,
        public tag?: string,
        public description?: string,
        public uri?: string,
        public status?: ArtifactStatus,
        public author?: string,
        public license?: string,
        public interview?: BaseEntity,
        public thinkaloud?: BaseEntity,
    ) {
    }
}
