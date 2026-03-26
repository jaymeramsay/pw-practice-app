import { test, expect } from "@playwright/test"; 

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test.describe("Form Layouts Page", () => {
    test.beforeEach(async ({ page }) => {
         await page.getByText('Forms').click();
         await page.getByText('Form Layouts').click();
    })

    test('input fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('#inputEmail1');

        await usingTheGridEmailInput.fill('test@example.com');
       
         //generic assertion 
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual('test@example.com');

        //locator assertion
        //  await usingTheGridEmailInput.toHaveValue('test@example.com');
       
        await usingTheGridEmailInput.clear();

        //Example of code that allows the test to type as a user would type 
        // by slowing down the typing speed
        //await usingTheGridEmailInput.pressSequentially('name of the test', { delay: 100 });
    })

    test('radio buttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-radio')

        await usingTheGridForm.getByLabel('Option 1').check({force: true});
        //second way to grab the radio button and check it
        await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).check({ force: true }); 
        const radioStatus = usingTheGridForm.getByRole('radio', { name: 'Option 1' }).isChecked(); 
        expect(radioStatus).toBeTruthy();
        //another way to validate the radio button is checked
        // await expect(usingTheGridForm.getByRole('radio', { name: 'Option 2' })).toBeChecked();

        usingTheGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true }); 
        expect(await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).isChecked()).toBeFalsy();
        expect(await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).isChecked()).toBeTruthy();
    })

});

test.describe("Modals and Overlays Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Modals & Overlays').click();
        await page.getByText('Toastr').click();
    })

    test('checkboxes', async ({ page }) => {
        await page.getByRole('checkbox', { name: 'Hide on click' }).check({ force: true }); 
        await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({ force: true });
        await page.getByRole('checkbox', { name: 'Show toast with icon' }).uncheck({ force: true });

        //this loops through all of the checkboxes on the page and checks them all
        const allCheckboxes = page.getByRole('checkbox');
        for(const box of await allCheckboxes.all()){
            await box.check({ force: true });
            expect(await box.isChecked()).toBeTruthy();
            await box.uncheck({ force: true });
            expect(await box.isChecked()).toBeFalsy();
        }
    })

test('lists and dropdowns', async ({ page }) => {
    const dropdownMenu = page.locator('ngx-header nb-select'); 
    await dropdownMenu.click(); 

    page.getByRole('list') // when the list has a ul tag
    page.getByRole('listitem') //when the list has an li tag 
})
