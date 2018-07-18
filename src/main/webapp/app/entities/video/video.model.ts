import { BaseEntity } from './../../shared';

export const enum ArtifactStatus {
    'PRIVATE',
    'SUBMITED',
    'PUBLISHED'
}

export class Video implements BaseEntity {
    constructor(
        public id?: number,
        public tag?: string,
        public description?: string,
        public duration?: number,
        public uri?: string,
        public status?: ArtifactStatus,
        public recorded?: any,
        public author?: string,
        public license?: string,
        public interview?: BaseEntity,
        public thinkaloud?: BaseEntity,
    ) {
    }
}
