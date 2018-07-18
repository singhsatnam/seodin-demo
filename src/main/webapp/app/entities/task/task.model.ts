import { BaseEntity } from './../../shared';

export class Task implements BaseEntity {
    constructor(
        public id?: number,
        public tag?: string,
        public author?: string,
        public license?: string,
        public diaries?: BaseEntity[],
        public study?: BaseEntity,
    ) {
    }
}
