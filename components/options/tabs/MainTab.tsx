import { useState } from 'react';
import { ModeCard } from './main/ModeCard';
import { ActivityItem } from './main/ActivityItem';

const MODES = [
  { key: 'auto', label: 'Авто', tag: 'по умолчанию', desc: 'Подходит под правило — раскладываем сразу. Если совпадений нет — поведение по умолчанию.', showFallback: true },
  { key: 'hint', label: 'Подсказка', tag: 'с подтверждением', desc: 'Показываем, куда попадёт закладка, и даём изменить папку перед сохранением.' },
  { key: 'off', label: 'Выключен', tag: 'без вмешательства', desc: 'Обычные закладки браузера — расширение не вмешивается.' },
] as const;

const ACTIVITY = [
  { letter: 'r', color: '#e0746e', title: 'r/webdev — Show your project', folder: 'Соцсети / Reddit', rule: 'Соцсети', time: '2 мин назад' },
  { letter: 'h', color: '#5c9ee0', title: 'Архитектура браузерных расширений', folder: 'Чтение', rule: 'Чтение', time: '18 мин назад' },
  { letter: 'p', color: '#d06ec0', title: 'Dashboard UI inspiration board', folder: 'Инспирация', rule: 'Дизайн', time: '1 ч назад' },
  { letter: 'f', color: '#5c7ce0', title: 'Meta — открытая вакансия', folder: 'Соцсети', rule: 'Соцсети', time: '3 ч назад' },
];

export function MainTab() {
  const [mode, setMode] = useState('auto');
  return (
    <div>
      <h1 className="m-0 mb-1 text-[22px] font-bold text-text">Режим работы</h1>
      <p className="m-0 mb-[22px] text-[13.5px] text-muted max-w-[560px]">
        Определяет, что происходит, когда вы добавляете закладку. Изменяется здесь или прямо в попапе.
      </p>

      <div className="flex flex-col gap-[11px] max-w-[620px]">
        {MODES.map(({ key, ...rest }) => (
          <ModeCard key={key} {...rest} selected={mode === key} onSelect={() => setMode(key)} />
        ))}
      </div>

      <h2 className="mt-[30px] mb-[14px] text-[15px] font-bold text-text">Последние действия</h2>
      <div className="border border-border rounded-[11px] overflow-hidden max-w-[620px]">
        {ACTIVITY.map((a, i) => (
          <ActivityItem key={i} {...a} isLast={i === ACTIVITY.length - 1} />
        ))}
      </div>
    </div>
  );
}
