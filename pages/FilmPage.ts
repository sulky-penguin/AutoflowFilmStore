import { expect, type Locator, type Page } from '@playwright/test';

export class FilmPage {
    readonly filmList: Locator; 
    readonly filmListHeaderRow: Locator;
    readonly formTitleDiv: Locator; 
    readonly formReleaseYearDiv: Locator; 
    readonly formDirectorDiv: Locator; 
    readonly formRatingDiv: Locator; 

    readonly formTitleTextBox: Locator; 
    readonly formReleaseYearTextBox: Locator; 
    readonly formDirectorTextBox: Locator; 
    readonly formRatingTextBox: Locator; 


    constructor(page: Page) {
        this.filmList = page.locator('tbody tr'); 
        this.filmListHeaderRow = page.locator('thead tr').first();
        this.formTitleDiv = page.locator('div').filter({ hasText: 'Title:' }); 
        this.formReleaseYearDiv = page.locator('div').filter({ hasText: 'Release Year:' }); 
        this.formDirectorDiv = page.locator('div').filter({ hasText: 'Director:' }); 
        this.formRatingDiv = page.locator('div').filter({ hasText: 'Rating (X out of 10):' }); 

        this.formTitleTextBox = page.getByRole('textbox', { name: 'Title:' });
        this.formReleaseYearTextBox = page.getByRole('textbox', { name: 'Release Year' });
        this.formDirectorTextBox = page.getByRole('textbox', { name: 'Director' });
        this.formRatingTextBox = page.getByRole('textbox', { name: 'Rating (X out of 10)' });
    }
}