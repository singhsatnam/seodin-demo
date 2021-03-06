import { BaseEntity } from './../../shared';

export class Interview implements BaseEntity {
    constructor(
        public id?: number,
        public tag?: string,
        public description?: string,
        public author?: string,
        public license?: string,
        public audio?: BaseEntity[],
        public videos?: BaseEntity[],
        public notes?: BaseEntity[],
        public developer?: BaseEntity,
    ) {
    }
}
