import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('clr-lift-lang')) localStorage.setItem('clr-lift-lang', 'en');
  });
  await page.goto('/ngx-lift/query/mutateResource');
});

test('domain definitions share refreshes while summary disposal and other scopes stay independent', async ({page}) => {
  const demo = page.getByTestId('team-ownership-demo');
  const rows = demo.locator('tbody tr');
  await expect(rows).toHaveCount(2);
  await expect(demo.getByTestId('team-summary-count')).toHaveText('Team A summary: 2');
  await expect(demo.getByTestId('team-a-reads')).toHaveText('Team A requests: 1');
  await expect(demo.getByTestId('team-b-count')).toHaveText('Team B members (separate scope): 1');

  async function addMember(name: string, total: number, requests: number) {
    await demo.getByRole('textbox', {name: 'Name', exact: true}).fill(name);
    await demo.getByRole('button', {name: 'Add Member', exact: true}).click();
    await expect(rows).toHaveCount(total);
    await expect(rows.last()).toContainText(name);
    await expect(demo.getByTestId('team-a-reads')).toHaveText(`Team A requests: ${requests}`);
    await expect(demo.getByTestId('team-b-count')).toHaveText('Team B members (separate scope): 1');
    await expect(demo.getByTestId('team-b-reads')).toHaveText('Team B requests: 1');
  }

  await addMember('Diana Prince', 3, 2);
  await expect(demo.getByTestId('team-summary-count')).toHaveText('Team A summary: 3');

  await demo.getByRole('button', {name: 'Close summary', exact: true}).click();
  await addMember('Evan Brooks', 4, 3);
  await expect(demo.getByTestId('team-summary-count')).toHaveCount(0);

  await demo.getByRole('button', {name: 'Open summary', exact: true}).click();
  await expect(demo.getByTestId('team-summary-count')).toHaveText('Team A summary: 4');
  await expect(demo.getByTestId('team-a-reads')).toHaveText('Team A requests: 3');
  await addMember('Fatima Ali', 5, 4);
  await expect(demo.getByTestId('team-summary-count')).toHaveText('Team A summary: 5');
});

test('ownership guidance and callback API remain visible in every supported language', async ({page}) => {
  await page.goto('/ngx-lift/query/organization');
  test.setTimeout(60_000);
  const titles: Record<string, string> = {
    en: 'Domain-owned keys and tags',
    'zh-CN': '按领域管理 key 和 tag',
    'zh-TW': '按領域管理 key 與 tag',
    de: 'Schlüssel und Tags pro Domäne',
    es: 'Claves y etiquetas por dominio',
    fr: 'Clés et étiquettes par domaine',
    ja: 'ドメインで管理するキーとタグ',
    ko: '도메인에서 관리하는 키와 태그',
    nl: 'Sleutels en tags per domein',
    'pt-BR': 'Chaves e tags por domínio',
    ru: 'Ключи и теги на уровне домена',
  };
  for (const [locale, title] of Object.entries(titles)) {
    await page.evaluate((language) => localStorage.setItem('clr-lift-lang', language), locale);
    await page.reload();
    const guide = page.getByTestId('query-ownership-guide');
    await expect(guide.getByRole('heading', {level: 2})).toHaveText(title);
    await expect(guide).toContainText('resourceAsync');
    await expect(guide).toContainText('(result, args)');
    await expect(guide).not.toContainText('!! Key');
    await expect(guide).not.toContainText('removeQueries');
    await expect(guide).not.toContainText('invalidatesTags');
  }
});
