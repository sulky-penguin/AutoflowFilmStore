Tools used:
- VSCode as an editor
- Out of the box Locator tool from PlayWright to target elements
- I made use of AI to speed up some of the process for me, such as generating regex when evaluating the table contents. 
- Used a mix of AI, PlayWright docs and videos to get familiar with the classes available in PlayWright 

I opted to give playwright a try for this task! It would be something I'd need to gain familiarity with anyway, so it seemed logical to take this opportunity when putting this together

As mentioned in the initial interview, I only have a familiarity with PlayWright but was able to apply a lot of what I remember to picking this up. 

I also trialed using Maestro Studio in another branch. I recently discovered they support Web Testing now, and I wanted to give that a try. It seemed too limited for the scope
of the AC defined, which is why I did not proceed with it.

Running the tests resulted in quite a few fails which I detailed in an issue on GitHub, but I imagine that's expected.

I made helper class under pages/FimPage.ts to store the elements and helpful methods.

I have also separated the tests using test.describe to organise the tests based on each scenario

Made a conscious effort to keep action tasks out of the test themselves and place them in helper methods. To improve maintainability and keep tests tidy


Improvements I would've made:

- The regex in the test looks quite messy, would've moved that into a function to assert the rows
- I came across test step as a function in playwright. Would've liked to explore that more to improve test readability
- I realise I haven't placed any assertions to confirm Add film section is below the film table.  AFter writing the responsive layout tests i came across boundingBox class. I would use that and evaluate against the y axis of the relevant element
