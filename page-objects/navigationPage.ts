import { Page, Locator } from "@playwright/test"; 

export class NavigationPage {
    
    readonly page: Page
    readonly fromLayoutsMenuItem: Locator
    readonly datepickerMenutItem: Locator
    readonly smartTableMenuItem: Locator
    readonly toastrMenuItem: Locator
    readonly tooltipMenuItem: Locator
    
    constructor(page: Page) {
        this.page = page
        this.fromLayoutsMenuItem = page.getByText('Form Layouts')
        this.datepickerMenutItem = page.getByText('Datepicker')
        this.smartTableMenuItem = page.getByText('Smart Table')
        this.toastrMenuItem = page.getByText('Toastr')
        this.tooltipMenuItem = page.getByText('Tooltip')
    }

    async formLayoutsPage() { 
        await this.selectGroupMenuItems('Forms')
        await this.fromLayoutsMenuItem.click();
    }

    async datepickerPage() {
        await this.selectGroupMenuItems('Forms')
        await this.page.waitForTimeout(1000)
        await this.datepickerMenutItem.click();
    }

    async smartTablePage() {
        await this.selectGroupMenuItems('Tables & Data')
        await this.smartTableMenuItem.click();
    }

    async toastrPage() {
        await this.selectGroupMenuItems('Modals & Overlays')
        await this.toastrMenuItem.click();
    }

    async tooltipPage() {
        await this.selectGroupMenuItems('Modals & Overlays')
        await this.tooltipMenuItem.click(); 
    }
    //internal method that checks state of menu item to see if it is collasped or not
    private async selectGroupMenuItems(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState == "false")
            await groupMenuItem.click()
    }
}