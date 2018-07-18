import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SeodinStudyModule } from './study/study.module';
import { SeodinSoftwareSystemModule } from './software-system/software-system.module';
import { SeodinTaskModule } from './task/task.module';
import { SeodinDeveloperModule } from './developer/developer.module';
import { SeodinInterviewModule } from './interview/interview.module';
import { SeodinThinkAloudModule } from './think-aloud/think-aloud.module';
import { SeodinDiaryModule } from './diary/diary.module';
import { SeodinAudioModule } from './audio/audio.module';
import { SeodinVideoModule } from './video/video.module';
import { SeodinNoteModule } from './note/note.module';
import { SeodinDefectModule } from './defect/defect.module';
import { SeodinTestCaseModule } from './test-case/test-case.module';
import { SeodinInteractiveLogModule } from './interactive-log/interactive-log.module';
import { SeodinSourceCodeModule } from './source-code/source-code.module';
import { SeodinDesignPatternModule } from './design-pattern/design-pattern.module';
import { SeodinScriptModule } from './script/script.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        SeodinStudyModule,
        SeodinSoftwareSystemModule,
        SeodinTaskModule,
        SeodinDeveloperModule,
        SeodinInterviewModule,
        SeodinThinkAloudModule,
        SeodinDiaryModule,
        SeodinAudioModule,
        SeodinVideoModule,
        SeodinNoteModule,
        SeodinDefectModule,
        SeodinTestCaseModule,
        SeodinInteractiveLogModule,
        SeodinSourceCodeModule,
        SeodinDesignPatternModule,
        SeodinScriptModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SeodinEntityModule {}
