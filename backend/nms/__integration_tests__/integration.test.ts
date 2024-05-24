import { test, expect } from '@playwright/test';

test('Test Notification Form Elements', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:3000/');
 // before all, delete all notifications by clicking all delete buttons
  const deleteButtons = await page.$$('button:text("Delete")');
  for (const button of deleteButtons) {
    await button.click();
  }
  // Check if form elements are present
  const timeInputExists = await page.isVisible('#time');
  const titleInputExists = await page.isVisible('#title');
  const bodyTextareaExists = await page.isVisible('#body');
  const slugInputExists = await page.isVisible('#slug');
  const breakingNewsCheckboxExists = await page.isVisible('input[value="Breaking News"]');
  const weeklySummaryCheckboxExists = await page.isVisible('input[value="Weekly Summary"]');
  const dailySummaryCheckboxExists = await page.isVisible('input[value="Daily Summary"]');
  const scheduleButtonExists = await page.isVisible('button:text("Schedule Notification")');

  // Assert that all form elements are present
  expect(timeInputExists).toBeTruthy();
  expect(titleInputExists).toBeTruthy();
  expect(bodyTextareaExists).toBeTruthy();
  expect(slugInputExists).toBeTruthy();
  expect(breakingNewsCheckboxExists).toBeTruthy();
  expect(weeklySummaryCheckboxExists).toBeTruthy();
  expect(dailySummaryCheckboxExists).toBeTruthy();
  expect(scheduleButtonExists).toBeTruthy();
});

test('Test Notification Table Header', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:3000/');
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

test('Test Notification Form', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:3000/');
  // Fill out the form inputs
  await page.fill('#time', '2050-05-01T12:00');
  await page.fill('#title', 'Test Notification');
  await page.fill('#body', 'This is a test notification body');
  await page.fill('#slug', 'test-slug');
  await page.fill("#articlePublicationDate", '2022-02-01');
  await page.click('main');

  await page.selectOption("#mediaType", "article");
  await page.getByRole('checkbox', { name: 'Breaking News' }).check();

  // Submit the form
 const res = await page.getByRole('button', { name: 'Schedule Notification' }).click();
 console.log(res);

 // wait for the notification to be added
  await page.waitForSelector('tbody td');

  // wait 1 seconds for the notification to be added
  // await page.waitForTimeout(1000);

  // Check if notification is displayed in the table
  const notificationExists = await page.isVisible('text=pending');
  expect(notificationExists).toBeTruthy();
});

test('Test Notification Deletion', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:3000/');
  // Find the delete button and click it
  await page.getByRole('button', { name: 'Delete' }).click();

  // Wait for notification to be deleted
  await page.waitForSelector('tbody td', { state: 'detached' });



  // Check if notification is no longer in the table
  const notificationExists = await page.isVisible('text=pending');
  expect(notificationExists).toBeFalsy();
});
