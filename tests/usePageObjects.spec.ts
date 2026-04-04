import { test, expect } from "@playwright/test"; 
import { NavigationPage } from '../page-objects/navigationPage'
import { FormLayoutsPage } from '../page-objects/formLayoutsPage'
import { DatePicker } from "../page-objects/datepickerPage";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test('navigate to form page', async ( {page} ) => {
    const navigateTo = new NavigationPage(page)
    await navigateTo.formLayoutsPage()
    await navigateTo.datepickerPage()
    await navigateTo.smartTablePage()
    await navigateTo.toastrPage()
    await navigateTo.tooltipPage()
})

test('parametrized methods', async ( {page} ) => {
     const navigateTo = new NavigationPage(page)
     const onFormLayoutsPage = new FormLayoutsPage(page)
     const onDatePickerPage = new DatePicker(page)

     await navigateTo.formLayoutsPage()
     await onFormLayoutsPage.submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'Welcome1', "Option 1")
     await onFormLayoutsPage.submitInlineFormWithNameEmailAndCheckbox('John Smith', 'John@test.com', false)
     await navigateTo.datepickerPage()
     await onDatePickerPage.selectCommonDatepickerDateFromToday(5)
     await onDatePickerPage.selectDatepickerWithRangeFromToday(6, 15)
})


