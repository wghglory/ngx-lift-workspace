/* eslint-disable @typescript-eslint/no-unused-vars */
// Mock TranslationService
export class MockTranslationService {
  translate(key: string, ...args: string[]): string {
    // Implement as needed for testing
    return 'TranslatedText';
  }

  loadTranslationsForComponent(componentKey: string, translationsToAdd: Record<string, Record<string, string>>) {}
}
