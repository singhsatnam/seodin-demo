import { BaseEntity } from './../../shared';

export class Developer implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public license?: string,
        public interviews?: BaseEntity[],
        public diaries?: BaseEntity[],
        public thinkAlouds?: BaseEntity[],
        public defects?: BaseEntity[],
        public testCases?: BaseEntity[],
        public interactiveLogs?: BaseEntity[],
        public study?: BaseEntity,
    ) {
    }
}
