import { Page } from "@playwright/test"; 

export class NavigationPage {
    
    readonly page: Page
    
    constructor(page: Page) {
        this.page = page
    }

    async formLayoutsPage() { 
        await this.selectGroupMenuItems('Forms')
        await this.page.getByText('Form Layouts').click();
    }

    async datepickerPage() {
        await this.selectGroupMenuItems('Forms')
        await this.page.waitForTimeout(1000)
        await this.page.getByText('Datepicker').click();
    }

    async smartTablePage() {
        await this.selectGroupMenuItems('Tables & Data')
        await this.page.getByText('Smart Table').click();
    }

    async toastrPage() {
        await this.selectGroupMenuItems('Modals & Overlays')
        await this.page.getByText('Toastr').click();
    }

    async tooltipPage() {
        await this.selectGroupMenuItems('Modals & Overlays')
        await this.page.getByText('Tooltip').click(); 
    }
    //internal method that checks state of menu item to see if it is collasped or not
    private async selectGroupMenuItems(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState == "false")
            await groupMenuItem.click()
    }
}