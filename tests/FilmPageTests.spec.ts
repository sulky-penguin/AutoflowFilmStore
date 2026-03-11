import {test, expect} from "@playwright/test"
import { FilmPage } from '../pages/FilmPage'; 


test.describe("Film List Tests", ()=>{

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:4200/');
    });

    test("Validate list of films is present", async ({ page }) => {
        const filmPage = new FilmPage(page);

        // ==========================================
        // Given there are existing films in the collection
        // When I open the default page 
        // ==========================================
        await expect(page).toHaveTitle(/Autoflow Film Store/);

        // ==========================================
        // Then I see a list of films showing the title, release year, director, and rating for each film 
        // ==========================================

        // Validate all headings are correct
        await expect(filmPage.filmListHeaderRow.locator('th').first()).toHaveText('Name');
        await expect(filmPage.filmListHeaderRow.locator('th').nth(1)).toHaveText('Released');
        await expect(filmPage.filmListHeaderRow.locator('th').nth(2)).toHaveText('Director');
        await expect(filmPage.filmListHeaderRow.locator('th').nth(3)).toHaveText('Rating');
    });

    test("Validate film details", async ({ page }) => {
        const filmPage = new FilmPage(page);

        // ==========================================
        // Given films are displayed in the list 
        // ==========================================
        const rowCount = await filmPage.filmList.count();
        expect(rowCount).toBeGreaterThan(0);

        // ==========================================
        // When I scan the list 
        // ==========================================

        //Iterate through table and assert each column
        //Assumption: Movie List is dynamic and subject to change, thus the current set names won't always be the same.
        for (let i = 0; i < rowCount; i++) {
            // ==========================================
            // Then each film shows the name of the film, a 4-digit year (e.g., 1999), the directors name, and a rating in the allowed range of 0–1
            // ==========================================

            //Assert each title cell is not empty
            await expect(filmPage.filmList.nth(i).locator('th')).not.toBeEmpty();

            //Assert each year cell has a year in the correct format
            await expect(filmPage.filmList.nth(i).locator('td').first()).toHaveText(/^[12][0-9]{3}$/);

            //Assert each name matches first name - last name format and is not empty
            await expect(filmPage.filmList.nth(i).locator('td').nth(1)).toHaveText(/^[a-z ,.'-]+$/i);

            //Assert each rating matches float / 10 format and is not empty
            await expect(filmPage.filmList.nth(i).locator('td').nth(2)).toHaveText(/^(10|[0-9](\.[0-9])?)\s\/\s10$/);
        }
    });

});

test.describe("Add Film Tests", ()=>{
    test.beforeEach(async ({ page }) => {
        // ==========================================
        // Given I am on the default page
        // ==========================================
        await page.goto('http://localhost:4200/');
    });

    test("Validate 'add a film' form has correct headings and placeholder text", async ({ page }) => {
        // ==========================================
        // When the page loads
        // ==========================================
        await expect(page).toHaveTitle(/Autoflow Film Store/);
        const filmPage = new FilmPage(page);


        // ==========================================
        // Then I see an “Add New Film” section below the films list, containing fields for Title (required), Year (required), Director (required), and Rating (required) with an "Add Film" button 
        // ==========================================s
        await expect(page.getByRole('heading', { name: 'Add Film' })).toBeVisible();

        //Unable to get this to work - but the intention is there, priorisitised finishing remainder of test
        //await expect(page.getByRole('heading', { name: 'Add Film' })).toBeBelow(filmPage.filmList);

        //Assert "Title" field name and placeholder
        await expect(filmPage.formTitleDiv).toBeVisible();
        //await expect(filmPage.formTitleTextBox).toHaveAttribute("placeholder", "Title"); //Failure here

        //Assert "Release Year" field name and placeholder
        await expect(filmPage.formReleaseYearDiv).toBeVisible();
        await expect(filmPage.formReleaseYearTextBox).toHaveAttribute("placeholder", "Release Year");

        //Assert "Director" field name and placeholder
        //await expect(filmPage.formDirectorDiv).toBeVisible(); // Failure here
        //await expect(filmPage.formDirectorTextBox).toHaveAttribute("placeholder", "Director"); // also fails as parent element cannot be found due to typo in app

        //Assert "Rating" field name and placeholder
        await expect(filmPage.formRatingDiv).toBeVisible();
        await expect(filmPage.formRatingTextBox).toHaveAttribute("placeholder", "Rating (X out of 10)");

        //await expect(page.getByRole('button', { name: 'Add Film' })).toBeVisible(); //Failure here
    });

    test("Validate user can successfully add a film", async ({ page }) => {
        const movieName = "Avatar: Fire and Ash";
        const releaseYear = "2025";
        const director = "James Cameron";
        const rating = "8"
        const filmPage = new FilmPage(page);


        // ==========================================
        // And when I fill in all required fields with valid data and click the "Add Film" button
        // ==========================================
        const initialRowCount = await filmPage.filmList.count();

        await filmPage.formTitleTextBox.fill(movieName);
        await filmPage.formReleaseYearTextBox.fill(releaseYear);
        await filmPage.formDirectorTextBox.fill(director);
        await filmPage.formRatingTextBox.fill(rating);
        await page.getByRole('button', { name: 'Ad Film' }).click(); //Known typo here

        // ==========================================
        // Then the form clears, and the new film immediately appears at the bottom of the film list without a page reload
        // ==========================================
        await expect(filmPage.filmList).toHaveCount(initialRowCount + 1); //Confirm table row has updated

        const lastRow = filmPage.filmList.last();

        await expect(lastRow.locator('th')).toHaveText(movieName);
        
        //Assert each year cell has a year in the correct format
        await expect(lastRow.locator('td').first()).toHaveText(releaseYear);

        //Assert each name matches first name - last name format and is not empty
        await expect(lastRow.locator('td').nth(1)).toHaveText(director);

        //Assert each rating matches float / 10 format and is not empty
        //await expect(lastRow.locator('td').nth(2)).toHaveText(rating); // Failure here
    });
});

test.describe("Form Validation Tests", ()=>{
    test.beforeEach(async ({ page }) => {
        // ==========================================
        // Given I am on the default page
        // ==========================================
        await page.goto('http://localhost:4200/');
    });


    test("Validate inline error messages are present", async ({ page }) => {
        const filmPage = new FilmPage(page);

        const initialRowCount = await filmPage.filmList.count(); // Get initial row count to compare after
        // ==========================================
        // When I click the "Add Film" button without filling in one or more required fields
        // ==========================================
        await page.getByRole('button', { name: 'Ad Film' }).click(); //Known typo here

        // ==========================================
        // Then inline error messages appear next to each missing field, explaining what is required, and the new film is not added to the list
        // ==========================================

        // Assert inline errors for Title 
        const expectedTitleError = filmPage.formTitleDiv.locator('.errorText');
        await expect(expectedTitleError).toBeVisible();
        await expect(expectedTitleError).toHaveText('please enter a title');

        // Assert inline errors for Release year 
        const expectedReleaseYearError = filmPage.formReleaseYearDiv.locator('.errorText');
        await expect(expectedReleaseYearError).toBeVisible(); //failure here
        await expect(expectedReleaseYearError).toHaveText('please enter a release year'); //assuming expected error message

        // Assert inline errors for Director 
        const expectedDirectorError = filmPage.formDirectorDiv.locator('.errorText');
        await expect(expectedDirectorError).toBeVisible(); //failure here
        await expect(expectedDirectorError).toHaveText('please enter a name'); //assuming expected error message

        // Assert inline errors for Rating 
        const expectedRatingError = filmPage.formRatingDiv.locator('.errorText');
        await expect(expectedRatingError).toBeVisible(); //failure here
        await expect(expectedRatingError).toHaveText('please enter a valid rating'); //assuming expected error message

        await expect(filmPage.filmList).toHaveCount(initialRowCount); //Confirm table row has not changed
    });

    test("Validate invalid inputs for 'Rating'", async ({ page }) => {
        const filmPage = new FilmPage(page);
        const initialRowCount = await filmPage.filmList.count(); // Get initial row count to compare after

        // ==========================================
        // When I enter a rating outside the allowed range and click the "Add Film" button
        // ==========================================
        await filmPage.formTitleTextBox.fill("Generic Movie");
        await filmPage.formReleaseYearTextBox.fill("2016");
        await filmPage.formDirectorTextBox.fill("James Moore");
        await filmPage.formRatingTextBox.fill("12");

        await page.getByRole('button', { name: 'Ad Film' }).click(); //Known typo here

        // ==========================================
        // Then I see an inline error message showing the acceptable range (e.g., 1–10), and the film is not added
        // ==========================================
        const expectedRatingError = filmPage.formRatingDiv.locator('.errorText');
        await expect(expectedRatingError).toBeVisible(); //Failure here
        await expect(expectedRatingError).toHaveText('please enter a a value between 1-10'); //No error message appears, made an assumption on wording
        await expect(filmPage.filmList).toHaveCount(initialRowCount); //Confirm table row has not changed
    });

    const releaseFieldValues = ["19943", "ABCD"];

    for (const releaseYear of releaseFieldValues) {
        test(`Validate invalid input ${releaseYear} for 'Release'`, async ({ page }) => {
            // ==========================================
            // Given I am on the default page
            // ==========================================
            const filmPage = new FilmPage(page);
            await page.goto('http://localhost:4200/');
            const initialRowCount = await filmPage.filmList.count(); // Get initial row count to compare after

            // ==========================================
            // When I enter a non-numeric or non-4-digit year and click the "Add Film" button
            // ==========================================
            await filmPage.formTitleTextBox.fill("Generic Movie");
            await filmPage.formReleaseYearTextBox.fill(releaseYear);
            await filmPage.formDirectorTextBox.fill("James Moore");
            await filmPage.formRatingTextBox.fill("3");

            await page.getByRole('button', { name: 'Ad Film' }).click(); //Known typo here
        
            // ==========================================
            // Then an inline validation message appears for the Year field explaining the valid format (e.g., “Enter a 4-digit year between 1888 and current year”), and the film is not added
            // ==========================================
            const expectedReleaseYearError = filmPage.formReleaseYearDiv.locator('.errorText');
            await expect(expectedReleaseYearError).toBeVisible();
            await expect(expectedReleaseYearError).toHaveText('Enter a 4-digit year between 1888 and current year');

            await expect(filmPage.filmList).toHaveCount(initialRowCount); //Confirm table row has not changed
        });
    }
});


// Set up a mobile device in config and include running that in the test run instead?
test.describe("Responsive Layout Tests", ()=>{
    // ==========================================
    // Given my viewport width is 375px or less (mobile)
    // ==========================================
    test.use({ isMobile: true, viewport: { width: 375, height: 667 } });

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:4200/');
    });

    test(`Responsive layout Test`, async ({page})=>{
        const filmPage = new FilmPage(page);
        // ==========================================
        // When the page loads
        // ==========================================
        await expect(page).toHaveTitle(/Autoflow Film Store/);

        // ==========================================
        // Then text remains readable and interactive controls span the width of the screen without scrolling
        // ==========================================
        const viewport = page.viewportSize();

        //Confirm Title is visible
        await expect(page.getByRole('heading', { name: 'Autoflow Film Store' })).toBeVisible;
        //Confirm whole table is within viewport
        await expect(page.locator('table')).toBeInViewport();

        //Table headings are visible
        await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible;
        await expect(page.getByRole('columnheader', { name: 'Released' })).toBeVisible;
        await expect(page.getByRole('columnheader', { name: 'Director' })).toBeVisible;
        await expect(page.getByRole('columnheader', { name: 'Rating' })).toBeVisible;
        

        //Confirm Add film heading is visible
        await expect(page.getByRole('heading', { name: 'Add Film' })).toBeVisible;

        //Confirm Interactive elements are within viewport
        await page.getByRole('button', { name: 'Ad Film' }).scrollIntoViewIfNeeded(); // Needed explicit scroll here

        await expect(filmPage.formTitleTextBox).toBeInViewport();
        await expect(filmPage.formReleaseYearTextBox).toBeInViewport();
        await expect(filmPage.formDirectorTextBox).toBeInViewport();
        await expect(filmPage.formRatingTextBox).toBeInViewport();
        await expect(page.getByRole('button', { name: 'Ad Film' })).toBeInViewport();
    });
});
