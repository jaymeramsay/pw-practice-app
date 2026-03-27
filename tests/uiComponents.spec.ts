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

    test('browser dialog boxes', async ({ page }) => { 
        await page.getByText('Dialog').click();
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

// part of the dialog box lesson but it lives on a different page than the Dialog section
 test('browser dialog boxes', async ({ page }) => { 
        await page.getByText('Tables & Data').click();
        await page.getByText('Smart Table').click();

        //create an event listenter
        page.on('dialog', async dialog => {
            expect(dialog.message()).toEqual('Are you sure you want to delete?'); 
            dialog.accept();
        })

        await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('nb-trash').click(); 
        await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');
 });

// this test shows how to specifically target a table row and then click on an element within that row. 
// This is a common use case when working with tables.
 test('web tables', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    // 1 get this row by any test in this row
    const targetRow = page.getByRole('row', { name: 'twitter@outlook.com' });
    await targetRow.locator('nb-edit').click(); //clicks the edit button in targetRow
    await targetRow.locator('input-editor').getByPlaceholder('Age').clear(); // since the 'twitter@outlook.com' is a
    // property value and not html text, we had to use a different approach to grab the cell that we wanted to change the age input
    await targetRow.locator('input-editor').getByPlaceholder('Age').fill('25'); 
    await page.locator('nb-checkmark').click(); // clicks the checkmark to save the changes 

    //2 get the row based on the value in a specific column 
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click(); // navigate to the second page of the table 
    const targetRowByID = page.getByRole('row', { name: '11' }).filter({has: page.locator('td').nth(1).getByText('11')}); // this is an example of how to grab a 
    // row based on the value in a specific column. In this case, we are grabbing the row where the value in the second column is '11'.
    await targetRowByID.locator('.nb-edit').click(); 
    await page.locator('input-editor').getByPlaceholder('Email').clear()
    await page.locator('input-editor').getByPlaceholder('Email').fill('test@test.com')
    await expect(targetRowByID.locator('td').nth(5)).toHaveText('test@test.com')

    //3 test filter of the table
    const ages = ['20', '30', '40', '200'] //test data

    //created a loop to loop through each of the test data values
    for(let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500) //this delay is created because playwright was running faster than the page could load
        const ageRows = page.locator('tbody tr')

        // created a second loop to loop through age values and assert the values match
        for(let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent();
            if(age = "200"){
                expect(await page.getByRole('table').textContent()).toContain('No Data Found')
            } else {
                expect(cellValue).toEqual(age)
            }
            expect(cellValue).toEqual(age);
        }
    }
 })

 test('datepicker', async ({page}) => {
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    //helps locate the specific date of June 1 2023. you need a unique locator which is why
    //we used the entire class and not just one. {exact: true} helps find the exact number instead of a partial match
    // await page.locator('[class="day-cell ng-star-inserted"]').getByText('1',{exact: true}).click()
    //await expect(calendarInputField).toHaveValue('June 1, 2023')

    let date = new Date();
    date.setDate(date.getDate() + 1)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    //expectedDate variable replaces the static number of 1 to make the code more dynamic
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact:true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)

 })