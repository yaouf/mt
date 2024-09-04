import { expect, test } from "@playwright/test";
import * as admin from "firebase-admin";

test.beforeEach(async ({ page }) => {
    // Navigate to the page
    await page.goto("http://localhost:3000/");
    // wait 1 second for buttons to load
    await page.waitForTimeout(1000);
    // Login using environment variables as credentials
    await page.fill("#email", "test@example.com");
    await page.fill("#password", "password");
    await page.click('button:text("Login")');
    // wait 1 second for buttons to load
    await page.waitForTimeout(1000);
});
// const thing = fs.readFileSync('secrets/serviceAccountKey.json', 'utf8');
// console.log("JSON: ", thing);
// const stringJson = JSON.parse(thing);
// let json;
// if (typeof stringJson == 'string') {
//     json = JSON.parse(stringJson);
// } else {
//   json = stringJson;
// }
// const serviceAccount = json;
import serviceAccount from "../secrets/serviceAccountKey.json";

test.beforeAll(async () => {
  // Initialize Firebase Admin with emulator config
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  await deleteMockUser().catch(console.error);
  await createMockUser().catch(console.error);
});

async function createMockUser() {
  await admin.auth().createUser({
    uid: "test-uid",
    email: "test@example.com",
    emailVerified: true,
    password: "password",
    displayName: "Test User",
    disabled: false,
  });

  console.log("Mock user created");
}

async function deleteMockUser() {
  await admin.auth().deleteUser("test-uid");
  console.log("Mock user deleted");
}

test("Test Notification Form Elements", async ({ page }) => {
  // before all, delete all notifications by clicking all delete buttons
  const deleteButtons = await page.$$('button:text("Delete")');
  for (const button of deleteButtons) {
    await button.click();
  }
  // Check if form elements are present
  const timeInputExists = await page.isVisible("#time");
  const titleInputExists = await page.isVisible("#title");
  const bodyTextareaExists = await page.isVisible("#body");
  const slugInputExists = await page.isVisible("#slug");
  const breakingNewsCheckboxExists = await page.isVisible(
    'input[value="Breaking News"]'
  );
  const universityNewsCheckboxExists = await page.isVisible(
    'input[value="University News"]'
  );
  const metroCheckboxExists = await page.isVisible('input[value="Metro"]');
  const scheduleButtonExists = await page.isVisible(
    'button:text("Schedule Notification")'
  );

  // Assert that all form elements are present
  expect(timeInputExists).toBeTruthy();
  expect(titleInputExists).toBeTruthy();
  expect(bodyTextareaExists).toBeTruthy();
  expect(slugInputExists).toBeTruthy();
  expect(breakingNewsCheckboxExists).toBeTruthy();
  expect(universityNewsCheckboxExists).toBeTruthy();
  expect(metroCheckboxExists).toBeTruthy();
  expect(scheduleButtonExists).toBeTruthy();
});

test("Test Notification Table Header", async ({ page }) => {
  // Check if table headers are present
  const timeHeaderExists = await page.isVisible('th:text("Time")');
  const titleHeaderExists = await page.isVisible('th:text("Title")');
  const bodyHeaderExists = await page.isVisible('th:text("Body")');
  const pathnameHeaderExists = await page.isVisible('th:text("Pathname")');
  const tagsHeaderExists = await page.isVisible('th:text("Tags")');
  const statusHeaderExists = await page.isVisible('th:text("Status")');
  const actionsHeaderExists = await page.isVisible('th:text("Actions")');

  // Assert that all table headers are present
  expect(timeHeaderExists).toBeTruthy();
  expect(titleHeaderExists).toBeTruthy();
  expect(bodyHeaderExists).toBeTruthy();
  expect(pathnameHeaderExists).toBeTruthy();
  expect(tagsHeaderExists).toBeTruthy();
  expect(statusHeaderExists).toBeTruthy();
  expect(actionsHeaderExists).toBeTruthy();
});

test("Test Notification Form", async ({ page }) => {
  // Fill out the form inputs
  await page.fill("#time", "2050-05-01T12:00");
  await page.fill("#title", "Test Notification");
  await page.fill("#body", "This is a test notification body");
  await page.fill("#slug", "test-slug");
  await page.fill("#articlePublicationDate", "2022-02-01");
  await page.click("main");

  await page.selectOption("#mediaType", "article");
  await page.getByRole("checkbox", { name: "Breaking News" }).check();

  // Submit the form
  const res = await page
    .getByRole("button", { name: "Schedule Notification" })
    .click();
  console.log(res);

  // wait for the notification to be added
  await page.waitForSelector("tbody td");

  // wait 1 seconds for the notification to be added
  // await page.waitForTimeout(1000);

  // Check if notification is displayed in the table
  const notificationExists = await page.isVisible("text=pending");
  expect(notificationExists).toBeTruthy();
});

test("Test Notification Deletion", async ({ page }) => {
  // Create a new notification
  await page.fill("#time", "2050-05-01T13:00");
  await page.fill("#title", "Test Notification");
  await page.fill("#body", "This is a test notification body 2");
  await page.fill("#slug", "test-slug-2");
  await page.fill("#articlePublicationDate", "2022-02-02");
  await page.click("main");

  await page.selectOption("#mediaType", "article");
  await page.getByRole("checkbox", { name: "Breaking News" }).check();

  // Submit the form
  const res = await page
    .getByRole("button", { name: "Schedule Notification" })
    .click();
  console.log(res);

    // Find the row that contains the specific text
    const row = page.locator('tr', { hasText: "test-slug-2" }).last();

    // Find the delete button within that row and click it
    const deleteButton = row.getByRole('button', { name: 'Delete' });
    await deleteButton.click();

  // Wait for notification to be deleted
  await expect(page.locator('tr', { hasText: "test-slug-2" })).not.toBeVisible();


  // Check if notification is no longer in the table
  const notificationExists = await page.isVisible("text=test-slug-2");
  expect(notificationExists).toBeFalsy();
});
