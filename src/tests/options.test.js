/**
 * Tests for options page
 */

const TIMEOUT = 0;

/**
 * Setup for tests
 */
beforeAll(async () => {
    const optionsURL = 'chrome-extension://mfjkehlppkpfjhgpmkleodnijoccllcm/options.html';
    await page.goto(optionsURL, {waitUntil: 'domcontentloaded', timeout: TIMEOUT});
});

/**
 * Tests initial state
 */
describe("Test initial state", () => {

    test("Check that table is empty", async () => {
        const tableLength = await page.evaluate(() => {

            // return number of subreddits
            const table = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];
            return table.rows.length;
        });

        expect(tableLength).toBe(0);
    });
});

/**
 * Tests adding subreddits
 */
describe("Test subreddit filter addition", () => {

    /**
     * Tests adding a single subreddit
     */
    test("Check that filter is correctly added upon button press", async () => {

        const subredditCount = await page.evaluate(() => {
            window.chrome = chrome;

            // mock inputting and adding an element
            const subredditInput = document.getElementById("subredditInput");
            const addButton = document.getElementById("addButton");

            subredditInput.value = "formula1";
            addButton.click();

            const subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            return subreddits.rows.length;
        });

        expect(subredditCount).toBe(1);

    });

    test("Check that filter name is correct", async () => {

        const name = await page.evaluate(() => {

            // mock inputting and adding an element
            const subredditInput = document.getElementById("subredditInput");
            const addButton = document.getElementById("addButton");

            subredditInput.value = "formula1";
            addButton.click();

            const subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // gets name of subreddit
            return subreddits.rows[0].children[0].getElementsByTagName("input")[0].value;
        });

        expect(name).toBe("formula1");
    });

    test("Check that filter categories exist", async () => {

        const categoryExists = await page.evaluate(() => {

            // mock inputting and adding an element
            const subredditInput = document.getElementById("subredditInput");
            const addButton = document.getElementById("addButton");

            subredditInput.value = "formula1";
            addButton.click();

            const subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // checks whether filter category exists
            return subreddits.rows[0].children[1].getElementsByTagName("select")[0] !== null;
        });

        expect(categoryExists).toBe(true);
    });

    test("Check that filter date exists", async () => {

        const datetimeExists = await page.evaluate(() => {

            // mock inputting and adding an element
            const subredditInput = document.getElementById("subredditInput");
            const addButton = document.getElementById("addButton");

            subredditInput.value = "formula1";
            addButton.click();

            const subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // checks whether datetime exists
            return subreddits.rows[0].children[2].getElementsByTagName("input")[0] !== null;
        });

        expect(datetimeExists).toBe(true);
    });

    test("Check that filter is inactive", async () => {

        const isActive = await page.evaluate(() => {

            // mock inputting and adding an element
            const subredditInput = document.getElementById("subredditInput");
            const addButton = document.getElementById("addButton");

            subredditInput.value = "formula1";
            addButton.click();

            const subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // checks whether subreddit is active
            return subreddits.rows[0].children[3].getElementsByTagName("input")[0].checked;
        });

        expect(isActive).toBe(false);
    });

    test("Check that filter is unselected", async () => {

        const isSelected = await page.evaluate(() => {

            // mock inputting and adding an element
            const subredditInput = document.getElementById("subredditInput");
            const addButton = document.getElementById("addButton");

            subredditInput.value = "formula1";
            addButton.click();

            const subreddits = document.getElementById("subreddits")
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

        const subredditCount = await page.evaluate(() => {

            // mock input and adding an element
            const subredditInput = document.getElementById("subredditInput");
            const addButton = document.getElementById("addButton");

            subredditInput.value = "pics";
            addButton.click();
            subredditInput.value = "tennis";
            addButton.click();

            const subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            return subreddits.rows.length;
        });

        expect(subredditCount).toBe(2);
    });

    test("Check that filter names are correct", async () => {

        const names = await page.evaluate(() => {

            // mock input and adding an element
            const subredditInput = document.getElementById("subredditInput");
            const addButton = document.getElementById("addButton");

            subredditInput.value = "pics";
            addButton.click();
            subredditInput.value = "tennis";
            addButton.click();

            const subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // gets name of subreddits
            return {subreddit1: subreddits.rows[0].children[0].getElementsByTagName("input")[0].value,
                    subreddit2: subreddits.rows[1].children[0].getElementsByTagName("input")[0].value};
        });

        expect(names.subreddit1).toBe("pics");
        expect(names.subreddit2).toBe("tennis");
    });

    test("Check that filter categories exist", async () => {

        const categoryExists = await page.evaluate(() => {

            // mock input and adding an element
            const subredditInput = document.getElementById("subredditInput");
            const addButton = document.getElementById("addButton");

            subredditInput.value = "pics";
            addButton.click();
            subredditInput.value = "tennis";
            addButton.click();

            const subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // checks whether filter category exists
            return {subreddit1: subreddits.rows[0].children[1].getElementsByTagName("select")[0] !== null,
                    subreddit2: subreddits.rows[1].children[1].getElementsByTagName("select")[0] !== null};
        });

        expect(categoryExists.subreddit1).toBe(true);
        expect(categoryExists.subreddit2).toBe(true);
    });

    test("Check that filter dates exist", async () => {

        const datetimeExists = await page.evaluate(() => {

            // mock input and adding an element
            const subredditInput = document.getElementById("subredditInput");
            const addButton = document.getElementById("addButton");

            subredditInput.value = "pics";
            addButton.click();
            subredditInput.value = "tennis";
            addButton.click();

            const subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // checks whether datetime exists
            return {subreddit1: subreddits.rows[0].children[2].getElementsByTagName("input")[0] !== null,
                    subreddit2: subreddits.rows[1].children[2].getElementsByTagName("input")[0] !== null};
        });

        expect(datetimeExists.subreddit1).toBe(true);
        expect(datetimeExists.subreddit2).toBe(true);
    });

    test("Check that filters are inactive", async () => {

        const isActive = await page.evaluate(() => {

            // mock input and adding an element
            const subredditInput = document.getElementById("subredditInput");
            const addButton = document.getElementById("addButton");

            subredditInput.value = "pics";
            addButton.click();
            subredditInput.value = "tennis";
            addButton.click();

            const subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            // checks whether subreddit is active
            return {subreddit1: subreddits.rows[0].children[3].getElementsByTagName("input")[0].checked,
                    subreddit2: subreddits.rows[1].children[3].getElementsByTagName("input")[0].checked};
        });

        expect(isActive.subreddit1).toBe(false);
        expect(isActive.subreddit2).toBe(false);

    });

    test("Check that filters are unselected", async () => {
        const isSelected = await page.evaluate(() => {

            // mock input and adding an element
            const subredditInput = document.getElementById("subredditInput");
            const addButton = document.getElementById("addButton");

            subredditInput.value = "pics";
            addButton.click();
            subredditInput.value = "tennis";
            addButton.click();

            const subreddits = document.getElementById("subreddits")
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

        const subredditCount = await page.evaluate(() => {

            // mock input and adding an element
            const subredditInput = document.getElementById("subredditInput");
            const addButton = document.getElementById("addButton");

            subredditInput.value = "nba";
            addButton.click();
            subredditInput.value = "nba";
            addButton.click();

            const subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];

            return subreddits.rows.length;
        });

        expect(subredditCount).toBe(1);

    });

});

describe("Test subreddit filter deletion", () => {

    // Reloads page and sets up subreddits before each test
    beforeEach(async () => {
        await page.reload({waitUntil: 'domcontentloaded'});

        await page.evaluate(() => {

            const subredditInput = document.getElementById("subredditInput");
            const addButton = document.getElementById("addButton");

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

        const subredditCount = await page.evaluate(() => {

            // mock selecting an element
            const subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];
            subreddits.rows[1].children[4].getElementsByTagName("input")[0].checked = true;

            // mock deleting an element
            const deleteButton = document.getElementById("deleteButton");

            deleteButton.click();

            return subreddits.rows.length;
        });

        expect(subredditCount).toBe(2);
    });

    /**
     * Tests deleting multiple subreddits
     */
    test("Check that filters are correctly deleted", async () => {

        const subredditCount = await page.evaluate(() => {

            // mock selecting elements
            const subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];
            subreddits.rows[0].children[4].getElementsByTagName("input")[0].checked = true;
            subreddits.rows[1].children[4].getElementsByTagName("input")[0].checked = true;

            // mock deleting elements
            const deleteButton = document.getElementById("deleteButton");

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

            const subredditInput = document.getElementById("subredditInput");
            const addButton = document.getElementById("addButton");

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
        const names = await page.evaluate(() => {

            // mock changing subreddit name
            const subreddits = document.getElementById("subreddits")
                .getElementsByTagName("tbody")[0];
            const updateButton = document.getElementById("updateButton");

            subreddits.rows[1].children[0].getElementsByTagName("input")[0].value = "news";
            updateButton.click();

            // gets name of subreddits
            return {subreddit1: subreddits.rows[0].children[0].getElementsByTagName("input")[0].value,
                subreddit2: subreddits.rows[1].children[0].getElementsByTagName("input")[0].value};
        });

        expect(names.subreddit1).toBe("news");
        expect(names.subreddit2).toBe("AskReddit");

    });

});