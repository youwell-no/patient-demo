import { renderToStaticMarkup } from 'react-dom/server';
import globalTranslations from './texts.json';
import commonTranslations from '../../youwell-common/translations.json';

export const translations = { ...globalTranslations, ...commonTranslations };

export const initialization = {
    languages: [
        { name: 'Norsk', code: 'no' },
        { name: 'English', code: 'en' },
    ],
    translation: translations,
    options: {
        renderToStaticMarkup,
        defaultLanguage: 'no',
        onMissingTranslation: obj => `missing translation for ${obj.translationId}`,
    },
};
