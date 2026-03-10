import {test, expect} from "@playwright/test"

test("Film List Test", async ({page})=>{

    //// Given there are existing films in the collection ////
    //// When I open the default page ////
    await page.goto('http://localhost:4200/');
    await expect(page).toHaveTitle(/Autoflow Film Store/);
    
    //// Then I see a list of films showing the title, release year, director, and rating for each film ////
    //Get header row and validate all headings are correct
    const headerRow = page.locator('thead tr').first(); 
    await expect(headerRow.locator('th').first()).toHaveText('Name');
    await expect(headerRow.locator('th').nth(1)).toHaveText('Released');
    await expect(headerRow.locator('th').nth(2)).toHaveText('Director');
    await expect(headerRow.locator('th').nth(3)).toHaveText('Rating');

    //// Given films are displayed in the list ////
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    //// When I scan the list ////
    //Iterate through table and assert each column
    //Assumption: Movie List is dynamic and subject to change, thus the current set names won't always be the same.
    for (let i = 0; i < rowCount; i++) {
         //// Then each film shows the name of the film, a 4-digit year (e.g., 1999), the directors name, and a rating in the allowed range of 0–1 ////

        //Assert each title cell is not empty
        await expect(rows.nth(i).locator('th')).not.toBeEmpty();

        //Assert each year cell has a year in the correct format
        await expect(rows.nth(i).locator('td').first()).toHaveText(/^[12][0-9]{3}$/);

        //Assert each name matches first name - last name format and is not empty
        await expect(rows.nth(i).locator('td').nth(1)).toHaveText(/^[a-z ,.'-]+$/i);

        //Assert each rating matches float / 10 format and is not empty
        await expect(rows.nth(i).locator('td').nth(2)).toHaveText(/^(10|[0-9](\.[0-9])?)\s\/\s10$/);
    }
});

test("Add Film Test", async ({page})=>{


    // Given I am on the default page
    await page.goto('http://localhost:4200/');

    // When the page loads
    await expect(page).toHaveTitle(/Autoflow Film Store/);

    // Then I see an “Add New Film” section below the films list, containing fields for Title (required), Year (required), Director (required), and Rating (required) with an "Add Film" button
    await expect(page).toHaveTitle(/Add Film/);


    // Given I am on the default page
    // When I fill in all required fields with valid data and click the "Add Film" button
    // Then the form clears, and the new film immediately appears at the bottom of the film list without a page reload

});