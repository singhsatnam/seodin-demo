import { BaseEntity } from './../../shared';

export class SoftwareSystem implements BaseEntity {
    constructor(
        public id?: number,
        public tag?: string,
        public author?: string,
        public license?: string,
        public sourceCodes?: BaseEntity[],
        public diaries?: BaseEntity[],
        public testCases?: BaseEntity[],
        public thinkAlouds?: BaseEntity[],
        public study?: BaseEntity,
    ) {
    }
}
