import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering Ajax Request').click();
})

test('autowaiting', async ({page}) => {
    const successButton = page.locator('#ajaxButton');
    await successButton.click();
    const text = await page.locator('.bg-success').textContent()
    expect(text).toBe('Data loaded with AJAX get request.')
    
})