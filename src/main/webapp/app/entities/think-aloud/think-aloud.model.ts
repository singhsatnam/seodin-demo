import { BaseEntity } from './../../shared';

export class ThinkAloud implements BaseEntity {
    constructor(
        public id?: number,
        public tag?: string,
        public description?: string,
        public author?: string,
        public license?: string,
        public notes?: BaseEntity[],
        public videos?: BaseEntity[],
        public softwareSystem?: BaseEntity,
        public developer?: BaseEntity,
    ) {
    }
}
