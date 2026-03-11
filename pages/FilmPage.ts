import { expect, type Locator, type Page } from '@playwright/test';

export class FilmPage {
    readonly page: Page;
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

    readonly addFilmButton: Locator; 



    constructor(page: Page) {
        this.page = page;
        this.filmList = page.locator('tbody tr'); 
        this.filmListHeaderRow = page.locator('thead tr').first();
        this.formTitleDiv = page.locator('div').filter({ hasText: 'Title:' }); 
        this.formReleaseYearDiv = page.locator('div').filter({ hasText: 'Release Year:' }); 
        this.formDirectorDiv = page.locator('div').filter({ hasText: 'Directer:' }); //Known spelling issue! Just set it this way for sake of demo
        this.formRatingDiv = page.locator('div').filter({ hasText: 'Rating (X out of 10):' }); 

        this.formTitleTextBox = this.formTitleDiv.getByRole('textbox');
        this.formReleaseYearTextBox = this.formReleaseYearDiv.getByRole('textbox');
        this.formDirectorTextBox = this.formDirectorDiv.getByRole('textbox');
        this.formRatingTextBox = this.formRatingDiv.getByRole('textbox');

        this.addFilmButton = page.getByRole('button', { name: 'Ad Film' }); //Known typo here
    }

    async addFilm(title: string, year: string, director: string, rating: string) {
        await this.formTitleTextBox.fill(title);
        await this.formReleaseYearTextBox.fill(year);
        await this.formDirectorTextBox.fill(director);
        await this.formRatingTextBox.fill(rating);
        await this.page.getByRole('button', { name: 'Ad Film' }).click(); //Known typo here

  }

}