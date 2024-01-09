/**
 * Tests for options
 */

/**
 * Setup for tests
 */
beforeAll(async () => {
    const optionsURL = 'http://localhost:63342/subreddit-time-filter/dist/options.html';
    await page.goto(optionsURL, {waitUntil: 'domcontentloaded'});
})

/**
 * Tests initial state
 */
describe("Test initial state", () => {

    test("Check that table is empty", async () => {
        let tableLength = await page.evaluate(() => {

            // return number of subreddits
            let table = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];
            return table.rows.length;
        });

        expect(tableLength).toBe(0);
    });

    /**
     * Reloads page after each test
     */
    afterEach(async () => {
        await page.reload({waitUntil: "domcontentloaded"});
    });
})

/**
 * Tests adding subreddits
 */
describe("Test subreddit filter addition", () => {

    /**
     * Tests adding a single subreddit
     */
    test("Check that filter is correctly added upon button press", async () => {

        let subredditCount = await page.evaluate(() => {

            // mock inputting and adding an element
            let subredditInput = document.getElementById("subredditInput");
            let addButton = document.getElementById("addButton");

            subredditInput.value = "formula1";
            addButton.click();

            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            return subreddits.rows.length;
        });

        expect(subredditCount).toBe(1);

    });

    test("Check that filter name is correct", async () => {

        let name = await page.evaluate(() => {

            // mock inputting and adding an element
            let subredditInput = document.getElementById("subredditInput");
            let addButton = document.getElementById("addButton");

            subredditInput.value = "formula1";
            addButton.click();

            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // gets name of subreddit
            return subreddits.rows[0].children[0].getElementsByTagName("DIV")[0].innerHTML;
        });

        expect(name).toBe("formula1");
    });

    test("Check that filter categories exist", async () => {

        let categoryExists = await page.evaluate(() => {

            // mock inputting and adding an element
            let subredditInput = document.getElementById("subredditInput");
            let addButton = document.getElementById("addButton");

            subredditInput.value = "formula1";
            addButton.click();

            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // checks whether filter category exists
            return subreddits.rows[0].children[1].getElementsByTagName("select")[0] !== null;
        });

        expect(categoryExists).toBe(true);
    });

    test("Check that filter date exists", async () => {

        let datetimeExists = await page.evaluate(() => {

            // mock inputting and adding an element
            let subredditInput = document.getElementById("subredditInput");
            let addButton = document.getElementById("addButton");

            subredditInput.value = "formula1";
            addButton.click();

            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // checks whether datetime exists
            return subreddits.rows[0].children[2].getElementsByTagName("input")[0] !== null;
        });

        expect(datetimeExists).toBe(true);
    });

    test("Check that filter is inactive", async () => {

        let isActive = await page.evaluate(() => {

            // mock inputting and adding an element
            let subredditInput = document.getElementById("subredditInput");
            let addButton = document.getElementById("addButton");

            subredditInput.value = "formula1";
            addButton.click();

            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // checks whether subreddit is active
            return subreddits.rows[0].children[3].getElementsByTagName("input")[0].checked;
        });

        expect(isActive).toBe(false);
    });

    test("Check that filter is unselected", async () => {

        let isSelected = await page.evaluate(() => {

            // mock inputting and adding an element
            let subredditInput = document.getElementById("subredditInput");
            let addButton = document.getElementById("addButton");

            subredditInput.value = "formula1";
            addButton.click();

            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // checks whether subreddit is selected
            return subreddits.rows[0].children[4].getElementsByTagName("input")[0].checked;
        });

        expect(isSelected).toBe(false);
    });

    /**
     * Tests adding multiple subreddits
     */
    test("Check that filters are correctly added upon button press", async () => {

        let subredditCount = await page.evaluate(() => {

            // mock input and adding an element
            let subredditInput = document.getElementById("subredditInput");
            let addButton = document.getElementById("addButton");

            subredditInput.value = "pics";
            addButton.click();
            subredditInput.value = "tennis";
            addButton.click();

            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            return subreddits.rows.length;
        });

        expect(subredditCount).toBe(2);
    });

    test("Check that filter names are correct", async () => {

        let names = await page.evaluate(() => {

            // mock input and adding an element
            let subredditInput = document.getElementById("subredditInput");
            let addButton = document.getElementById("addButton");

            subredditInput.value = "pics";
            addButton.click();
            subredditInput.value = "tennis";
            addButton.click();

            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // gets name of subreddits
            return {subreddit1: subreddits.rows[0].children[0].getElementsByTagName("DIV")[0].innerHTML,
                    subreddit2: subreddits.rows[1].children[0].getElementsByTagName("DIV")[0].innerHTML};
        });

        expect(names.subreddit1).toBe("pics");
        expect(names.subreddit2).toBe("tennis");
    });

    test("Check that filter categories exist", async () => {

        let categoryExists = await page.evaluate(() => {

            // mock input and adding an element
            let subredditInput = document.getElementById("subredditInput");
            let addButton = document.getElementById("addButton");

            subredditInput.value = "pics";
            addButton.click();
            subredditInput.value = "tennis";
            addButton.click();

            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // checks whether filter category exists
            return {subreddit1: subreddits.rows[0].children[1].getElementsByTagName("select")[0] !== null,
                    subreddit2: subreddits.rows[1].children[1].getElementsByTagName("select")[0] !== null};
        });

        expect(categoryExists.subreddit1).toBe(true);
        expect(categoryExists.subreddit2).toBe(true);
    });

    test("Check that filter dates exist", async () => {

        let datetimeExists = await page.evaluate(() => {

            // mock input and adding an element
            let subredditInput = document.getElementById("subredditInput");
            let addButton = document.getElementById("addButton");

            subredditInput.value = "pics";
            addButton.click();
            subredditInput.value = "tennis";
            addButton.click();

            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // checks whether datetime exists
            return {subreddit1: subreddits.rows[0].children[2].getElementsByTagName("input")[0] !== null,
                    subreddit2: subreddits.rows[1].children[2].getElementsByTagName("input")[0] !== null};
        });

        expect(datetimeExists.subreddit1).toBe(true);
        expect(datetimeExists.subreddit2).toBe(true);
    });

    test("Check that filters are inactive", async () => {

        let isActive = await page.evaluate(() => {

            // mock input and adding an element
            let subredditInput = document.getElementById("subredditInput");
            let addButton = document.getElementById("addButton");

            subredditInput.value = "pics";
            addButton.click();
            subredditInput.value = "tennis";
            addButton.click();

            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // checks whether subreddit is active
            return {subreddit1: subreddits.rows[0].children[3].getElementsByTagName("input")[0].checked,
                    subreddit2: subreddits.rows[1].children[3].getElementsByTagName("input")[0].checked};
        });

        expect(isActive.subreddit1).toBe(false);
        expect(isActive.subreddit2).toBe(false);

    });

    test("Check that filters are unselected", async () => {
        let isSelected = await page.evaluate(() => {

            // mock input and adding an element
            let subredditInput = document.getElementById("subredditInput");
            let addButton = document.getElementById("addButton");

            subredditInput.value = "pics";
            addButton.click();
            subredditInput.value = "tennis";
            addButton.click();

            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // checks whether subreddit is active
            return {subreddit1: subreddits.rows[0].children[4].getElementsByTagName("input")[0].checked,
                    subreddit2: subreddits.rows[1].children[4].getElementsByTagName("input")[0].checked};
        });

        expect(isSelected.subreddit1).toBe(false);
        expect(isSelected.subreddit2).toBe(false);

    });

    /**
     * Tests adding multiple subreddits with duplicate names
     */
    test("Check that second subreddit is not added", async () => {

        let subredditCount = await page.evaluate(() => {

            // mock input and adding an element
            let subredditInput = document.getElementById("subredditInput");
            let addButton = document.getElementById("addButton");

            subredditInput.value = "nba";
            addButton.click();
            subredditInput.value = "nba";
            addButton.click();

            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            return subreddits.rows.length;
        });

        expect(subredditCount).toBe(1);

    });

    afterEach(async () => {
        await page.reload({waitUntil: "domcontentloaded"});
    });

});

describe("Test subreddit filter deletion", () => {

    // Reloads page and sets up subreddits before each test
    beforeEach(async () => {
        await page.reload({waitUntil: 'domcontentloaded'});

        await page.evaluate(() => {

            let subredditInput = document.getElementById("subredditInput");
            let addButton = document.getElementById("addButton");

            subredditInput.value = "ask";
            addButton.click();
            subredditInput.value = "UBC";
            addButton.click();
            subredditInput.value = "VALORANT";
            addButton.click();
        });

    });

    /**
     * Tests deleting a single subreddit
     */
    test("Check that filter is correctly deleted", async () => {

        let subredditCount = await page.evaluate(() => {

            // mock selecting an element
            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];
            subreddits.rows[1].children[4].getElementsByTagName("input")[0].checked = true;

            // mock deleting an element
            let deleteButton = document.getElementById("deleteButton");

            deleteButton.click();

            return subreddits.rows.length;
        });

        expect(subredditCount).toBe(2);
    });

    /**
     * Tests deleting multiple subreddits
     */
    test("Check that filters are correctly deleted", async () => {

        let subredditCount = await page.evaluate(() => {

            // mock selecting elements
            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];
            subreddits.rows[0].children[4].getElementsByTagName("input")[0].checked = true;
            subreddits.rows[1].children[4].getElementsByTagName("input")[0].checked = true;

            // mock deleting elements
            let deleteButton = document.getElementById("deleteButton");

            deleteButton.click();

            return subreddits.rows.length;
        });

        expect(subredditCount).toBe(1);

    });

    afterEach(async () => {
        await page.reload({waitUntil: "domcontentloaded"});
    });

});

/**
 * Tests changing options for subreddits
 */
describe("Test changing subreddit filter options", () => {

    // Reloads page and sets up subreddits
    beforeEach(async () => {
        await page.reload({waitUntil: 'domcontentloaded'});

        await page.evaluate(() => {

            let subredditInput = document.getElementById("subredditInput");
            let addButton = document.getElementById("addButton");

            subredditInput.value = "news";
            addButton.click();
            subredditInput.value = "AskReddit";
            addButton.click();
        });

    });

    /**
     * Tests changing name so that subreddit names are duplicated
     */
    test("Check that names are unchanged", async () => {

        // when iterating through table the first time, keep map of names already evaluated
        let names = await page.evaluate(() => {

            // mock changing subreddit name
            let subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];
            let applyChangesButton = document.getElementById("applyChangesButton");

            subreddits.rows[1].children[0].getElementsByTagName("DIV")[0].innerHTML = "news";
            applyChangesButton.click();

            // gets name of subreddits
            return {subreddit1: subreddits.rows[0].children[0].getElementsByTagName("DIV")[0].innerHTML,
                subreddit2: subreddits.rows[1].children[0].getElementsByTagName("DIV")[0].innerHTML};
        });

        expect(names.subreddit1).toBe("news");
        expect(names.subreddit2).toBe("AskReddit");

    });

    afterEach(async () => {
        await page.reload({waitUntil: "domcontentloaded"});
    });

});