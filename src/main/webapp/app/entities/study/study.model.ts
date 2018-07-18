import { BaseEntity } from './../../shared';

export class Study implements BaseEntity {
    constructor(
        public id?: number,
        public title?: string,
        public description?: string,
        public author?: string,
        public license?: string,
        public developers?: BaseEntity[],
        public softwareSystems?: BaseEntity[],
        public scripts?: BaseEntity[],
        public tasks?: BaseEntity[],
    ) {
    }
}
