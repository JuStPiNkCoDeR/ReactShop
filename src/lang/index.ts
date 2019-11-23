import ru from './RU-ru';
import ILang from "./ILang";

export default function(lang: string): ILang {
    let ans: ILang = ru;

    switch (lang) {
        case 'Ru-ru':
            ans = ru;
            break
    }

    return ans;
}