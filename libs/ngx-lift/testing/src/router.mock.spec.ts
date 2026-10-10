import {describe, expect, it} from 'vitest';

import {RouterMock} from './router.mock';

describe('RouterMock', () => {
  it('should initialize with default mock behavior', async () => {
    const mock = new RouterMock();
    expect(mock.url).toBe('/');
    expect(await mock.navigate(['/home'])).toBe(true);
    expect(await mock.navigateByUrl('/home')).toBe(true);
    expect(mock.navigate).toHaveBeenCalledWith(['/home']);
    expect(mock.navigateByUrl).toHaveBeenCalledWith('/home');
  });
});
