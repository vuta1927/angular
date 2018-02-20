import { Subject } from 'rxjs/Subject';
import { I18nService } from 'app/shared/i18n/i18n.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { TestBed, inject } from '@angular/core/testing';

const defaultLanguage = { key: 'en-US' };
const supportedLanguages = [{ key: 'eo' }, { key: 'en-US' }, { key: 'fr-FR' }];

export class MockTranslateService {
    private currentLang: string;
    private onLangChange = new Subject();

    public use(language: any) {
        this.currentLang = language;
        this.onLangChange.next({
            lang: this.currentLang,
            translations: {}
        });
    }

    public getBrowserCultureLang() {
        return 'en-US';
    }

    // tslint:disable-next-line:no-empty
    public setTranslation(lang: string, translations: object, shouldMerge?: boolean) {}
}

describe('I18nService', () => {
    let i18nService: I18nService;
    let translateService: TranslateService;
    let onLangChangeSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                I18nService,
                { provide: TranslateService, useClass: MockTranslateService }
            ]
        });
    });

    beforeEach(inject([
        I18nService,
        TranslateService
    ], (_i18nService: I18nService,
        _translateService: TranslateService) => {

            i18nService = _i18nService;
            translateService = _translateService;

            onLangChangeSpy = jasmine.createSpy('onLangChangeSpy');
            translateService.onLangChange
                .subscribe((event: LangChangeEvent) => {
                    onLangChangeSpy(event.lang);
                });
            spyOn(translateService, 'use').and.callThrough();
        }));

    afterEach(() => {
        localStorage.removeItem('language');
    });

    describe('init', () => {
        it('should init with default language', () => {
            // Act
            i18nService.init(defaultLanguage, supportedLanguages);

            // Assert
            expect(translateService.use).toHaveBeenCalledWith(defaultLanguage.key);
            expect(onLangChangeSpy).toHaveBeenCalledWith(defaultLanguage.key);
        });

        it('should init with save language', () => {
            // Arrange
            const savedLanguage = 'eo';
            localStorage.setItem('language', savedLanguage);

            // Act
            i18nService.init(defaultLanguage, supportedLanguages);

            // Assert
            expect(translateService.use).toHaveBeenCalledWith(savedLanguage);
            expect(onLangChangeSpy).toHaveBeenCalledWith(savedLanguage);
        });
    });

    describe('set language', () => {
        it('should change current language', () => {
            // Arrange
            const newLanguage = { key: 'eo' };
            i18nService.init(defaultLanguage, supportedLanguages);

            // Act
            i18nService.language = newLanguage;

            // Assert
            expect(translateService.use).toHaveBeenCalledWith(newLanguage.key);
            expect(onLangChangeSpy).toHaveBeenCalledWith(newLanguage.key);
        });

        it('should change current language without a region match', () => {
            // Arrange
            const newLanguage = { key: 'fr-CA' };
            i18nService.init(defaultLanguage, supportedLanguages);

            // Act
            i18nService.language = newLanguage;

            // Assert
            expect(translateService.use).toHaveBeenCalledWith('fr-FR');
            expect(onLangChangeSpy).toHaveBeenCalledWith('fr-FR');
        });

        it('should change current language to default if unsupported', () => {
            // Arrange
            const newLanguage = { key: 'es' };
            i18nService.init(defaultLanguage, supportedLanguages);

            // Act
            i18nService.language = newLanguage;

            // Assert
            expect(translateService.use).toHaveBeenCalledWith(defaultLanguage.key);
            expect(onLangChangeSpy).toHaveBeenCalledWith(defaultLanguage.key);
        });
    });

    describe('get language', () => {
        it('should return current language', () => {
            // Arrange
            i18nService.init(defaultLanguage, supportedLanguages);

            // Act
            const currentLanguage = i18nService.language;

            // Assert
            expect(currentLanguage.key).toEqual(defaultLanguage.key);
        });
    });
});
