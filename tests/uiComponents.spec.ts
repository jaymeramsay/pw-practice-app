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
    })

    test('checkboxes', async ({ page }) => {
        await page.getByText('Toastr').click();
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

    test('tooltips', async ({ page }) => {
        await page.getByText('Tooltip').click(); 

        const toolTipCard = page.locator('nb-card', { hasText: 'Tooltip Placements' });
        await toolTipCard.getByRole('button', { name: 'Top' }).hover(); 

        // page.getByRole('tooltip') // this is another example of how to grab the tooltip
        // however, it will only work if a role attribute is added to the tooltip element in the code. 
        const tooltip = await page.locator('nb-tooltip').textContent(); //.innerText() might be a better option here depending on the situation.
        expect(tooltip).toEqual('This is a tooltip');
    })
});

test('lists and dropdowns', async ({ page }) => {
    const dropdownMenu = page.locator('ngx-header nb-select'); 
    await dropdownMenu.click(); 

    page.getByRole('list') // when the list has a ul tag
    page.getByRole('listitem') //when the list has an li tag
    
    // const optionlist = page.getByRole('list').locator('nb-option');  //example of how to grab the dropdown
    const optionList = page.locator('nb-option-list nb-option'); //this example is a little more concise but both work fine
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
    await optionList.filter({hasText: "Cosmic"}).click(); 
    const header = page.locator('nb-layout-header'); 
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)');

    const colors = {
        Light: 'rgb(255, 255, 255)',
        Dark: 'rgb(34, 43, 69)',
        Cosmic: 'rgb(50, 50, 89)',
        Corporate: 'rgb(255, 255, 255)'
    }
    await dropdownMenu.click();
    // for in loop cause we're looping through the object of the values
    for(const color in colors){
        await optionList.filter({hasText: color}).click();
        await expect(header).toHaveCSS('background-color', colors[color as keyof typeof colors]);
        if(color !== 'Corporate')
            await dropdownMenu.click();
    }
})
