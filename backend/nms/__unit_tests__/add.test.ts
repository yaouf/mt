// Import the handler under test and its config from the pages/api directory
import { testApiHandler } from "next-test-api-route-handler";
import * as pagesHandlerGetOne from "../pages/api/notifications/[jobId]";
import * as pagesHandlerAdd from "../pages/api/notifications/add";
import * as pagesHandlerDelete from "../pages/api/notifications/delete";
import * as pagesHandlerGetAll from "../pages/api/notifications/index";
import { notificationQueue, worker } from "../pages/api/queue/queue";

describe("adding, getting, and deleting notifications", () => {
  beforeAll(async () => {
    const count = await notificationQueue.count();
    if (count !== 0) {
      const notifs = await notificationQueue.getJobs();
      console.log("notification count", count);
      console.log("notifs", notifs);
      throw new Error("Queue is not empty");
      // await notificationQueue.drain(true);
    }
  });

  // close the queue after all tests
  afterAll(async () => {
    await worker.close();
    await notificationQueue.obliterate({ force: true });
    await notificationQueue.close();
  });

  it("creates notification", async () => {
    // NTARH supports optionally typed response data via TypeScript generics:

    // / Extract the notification data
    //   const time = data.time;
    //   const title = data.title;
    //   const body = data.body;
    //   const tags = data.tags;
    //   const slug = data.slug;
    //   const mediaType = data.mediaType;
    //   const publicationDate = data.publicationDate;

    await testApiHandler<any[]>({
      pagesHandler: pagesHandlerAdd,
      requestPatcher: (req) => {
        req.headers = { "x-api-key": process.env.API_KEY };
      },
      test: async ({ fetch }) => {
        const body = {
          time: "2060-03-20T14:27:00.601256+00:00",
          title: "Breaking News",
          body: "An advisory committee's recommendation on divestment will remain confidential until the Corporation votes on it this month, President Paxson says.",
          tags: ["Breaking News"],
          isUid: 0,
          url: "https://www.browndailyherald.com/article/2024/10/divestment-recommendation-will-remain-confidential-until-after-corporation-votes-paxson-says",
        };
        const blob = JSON.stringify(body);
        const res = await fetch({
          method: "POST",
          body: blob,
          headers: { "Content-Type": "application/json" },
        });
        // The next line would cause TypeScript to complain:
        // const { goodbye: hello } = await res.json();
        const result = await res.json();
        expect(result).toEqual([
          {
            body: "An advisory committee's recommendation on divestment will remain confidential until the Corporation votes on it this month, President Paxson says.",
            "Breaking News": 1,
            "University News": 0,
            Metro: 0,
            Sports: 0,
            "Arts and Culture": 0,
            "Science and Research": 0,
            "Opinions": 0,
            id: 1,
            url: "https://www.browndailyherald.com/article/2024/10/divestment-recommendation-will-remain-confidential-until-after-corporation-votes-paxson-says",
            status: "pending",
            time: "2060-03-20T14:27:00.601256+00:00",
            title: "Breaking News",
            isUid: 0,
          },
        ]); // ◄ Passes!
      },
    });
  });

  it("gets all notifications after adding first", async () => {
    // now get the notification that was added
    await testApiHandler<any[]>({
      pagesHandler: pagesHandlerGetAll,
      requestPatcher: (req) => {
        req.headers = { "x-api-key": process.env.API_KEY };
      },
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        // The next line would cause TypeScript to complain:
        // const { goodbye: hello } = await res.json();
        const jsonResult = await res.json();
        expect(jsonResult).toHaveLength(1); // ◄ Passes!
        expect(jsonResult).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              body: "An advisory committee's recommendation on divestment will remain confidential until the Corporation votes on it this month, President Paxson says.",
              "Breaking News": 1,
              "University News": 0,
              Sports: 0,
              "Arts and Culture": 0,
              "Science and Research": 0,
              "Opinions": 0,
              Metro: 0,
              id: 1,
              url: "https://www.browndailyherald.com/article/2024/10/divestment-recommendation-will-remain-confidential-until-after-corporation-votes-paxson-says",
              time: "2060-03-20T14:27:00.601256+00:00",
              title: "Breaking News",
              isUid: 0,
            }),
          ])
        ); // ◄ Passes!
      },
    });
  });

  it("adds second notification", async () => {
    await testApiHandler<any[]>({
      pagesHandler: pagesHandlerAdd,
      requestPatcher: (req) => {
        req.headers = { "x-api-key": process.env.API_KEY };
      },
      test: async ({ fetch }) => {
        const body = {
          time: "2060-03-20T14:27:00.601256+00:00",
          title: "Second",
          body: "World",
          tags: ["Breaking News"],
          url: "https://www.projects.browndailyherald.com/article/2022-03-01/second-world",
          isUid: 0,
        };
        const blob = JSON.stringify(body);
        const res = await fetch({
          method: "POST",
          body: blob,
          headers: { "Content-Type": "application/json" },
        });
        const result = await res.json();
        console.log(result);
        expect(result).toEqual([
          {
            body: "An advisory committee's recommendation on divestment will remain confidential until the Corporation votes on it this month, President Paxson says.",
            "Breaking News": 1,
            Metro: 0,
            id: 1,
            url: "https://www.browndailyherald.com/article/2024/10/divestment-recommendation-will-remain-confidential-until-after-corporation-votes-paxson-says",
            isUid: 0,
            status: "pending",
            time: "2060-03-20T14:27:00.601256+00:00",
            title: "Breaking News",
            "University News": 0,
            Sports: 0,
            "Arts and Culture": 0,
            "Science and Research": 0,
            "Opinions": 0,
          },
          {
            body: "World",
            "Breaking News": 1,
            Metro: 0,
            id: 2,
            url: "https://www.projects.browndailyherald.com/article/2022-03-01/second-world",
            isUid: 0,
            status: "pending",
            time: "2060-03-20T14:27:00.601256+00:00",
            title: "Second",
            "University News": 0,
            Sports: 0,
            "Arts and Culture": 0,
            "Science and Research": 0,
            "Opinions": 0,
          },
        ]); // ◄ Passes!
      },
    });
  });

  it("gets all notifications after second was added", async () => {
    // now get the notification that was added
    await testApiHandler<any[]>({
      pagesHandler: pagesHandlerGetAll,
      requestPatcher: (req) => {
        req.headers = { "x-api-key": process.env.API_KEY };
      },
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        // The next line would cause TypeScript to complain:
        // const { goodbye: hello } = await res.json();
        const jsonResult = await res.json();
        expect(jsonResult).toHaveLength(2); // ◄ Passes!
        expect(jsonResult).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              body: "An advisory committee's recommendation on divestment will remain confidential until the Corporation votes on it this month, President Paxson says.",
              "Breaking News": 1,
              Metro: 0,
              id: 1,
              url: "https://www.browndailyherald.com/article/2024/10/divestment-recommendation-will-remain-confidential-until-after-corporation-votes-paxson-says",
              isUid: 0,
              time: "2060-03-20T14:27:00.601256+00:00",
              title: "Breaking News",
              "University News": 0,
              Sports: 0,
              "Arts and Culture": 0,
              "Science and Research": 0,
              "Opinions": 0,
            }),
            expect.objectContaining({
              body: "World",
              "Breaking News": 1,
              Metro: 0,
              id: 2,
              url: "https://www.projects.browndailyherald.com/article/2022-03-01/second-world",
              isUid: 0,
              time: "2060-03-20T14:27:00.601256+00:00",
              title: "Second",
              "University News": 0,
              Sports: 0,
              "Arts and Culture": 0,
              "Science and Research": 0,
              "Opinions": 0,
            }),
          ])
        ); // ◄ Passes!
      },
    });
  });

  it("gets second single notification", async () => {
    // now get the notification that was added
    await testApiHandler<any[]>({
      pagesHandler: pagesHandlerGetOne,
      requestPatcher: (req) => {
        req.headers = { "x-api-key": process.env.API_KEY };
      },
      paramsPatcher: (params) => {
        params.jobId = 2;
      },
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        // The next line would cause TypeScript to complain:
        // const { goodbye: hello } = await res.json();
        const jsonResult = await res.json();
        expect(jsonResult).toEqual(
          expect.objectContaining({
            body: "World",
            "Breaking News": 1,
            Metro: 0,
            id: 2,
            url: "https://www.projects.browndailyherald.com/article/2022-03-01/second-world",
            isUid: 0,
            time: "2060-03-20T14:27:00.601256+00:00",
            title: "Second",
            "University News": 0,
            Sports: 0,
            "Arts and Culture": 0,
            "Science and Research": 0,
            "Opinions": 0,
          })
        ); // ◄ Passes!
      },
    });
  });

  it("gets first single notification", async () => {
    // now get the notification that was added
    await testApiHandler<any[]>({
      pagesHandler: pagesHandlerGetOne,
      requestPatcher: (req) => {
        req.headers = { "x-api-key": process.env.API_KEY };
      },
      paramsPatcher: (params) => {
        params.jobId = 1;
      },
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        // The next line would cause TypeScript to complain:
        // const { goodbye: hello } = await res.json();
        const jsonResult = await res.json();
        expect(jsonResult).toEqual(
          expect.objectContaining({
            body: "An advisory committee's recommendation on divestment will remain confidential until the Corporation votes on it this month, President Paxson says.",
            "Breaking News": 1,
            Metro: 0,
            id: 1,
            url: "https://www.browndailyherald.com/article/2024/10/divestment-recommendation-will-remain-confidential-until-after-corporation-votes-paxson-says",
            isUid: 0,
            time: "2060-03-20T14:27:00.601256+00:00",
            title: "Breaking News",
            "University News": 0,
            Sports: 0,
            "Arts and Culture": 0,
            "Science and Research": 0,
            "Opinions": 0,
          })
        ); // ◄ Passes!
      },
    });

    // now get the notification that was added
    await testApiHandler<any[]>({
      pagesHandler: pagesHandlerGetOne,
      requestPatcher: (req) => {
        req.headers = { "x-api-key": process.env.API_KEY };
      },
      paramsPatcher: (params) => {
        params.jobId = 3;
      },
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        // The next line would cause TypeScript to complain:
        // const { goodbye: hello } = await res.json();
        expect(res.body).toBeFalsy; // ◄ Passes!
      },
    });
  });

  it("deletes a notification", async () => {
    // deletes the notification that was added
    await testApiHandler<any[]>({
      pagesHandler: pagesHandlerDelete,
      requestPatcher: (req) => {
        req.headers = { "x-api-key": process.env.API_KEY };
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId: 1,
          }),
        });
        // The next line would cause TypeScript to complain:
        // const { goodbye: hello } = await res.json();
        const jsonResult = await res.json();
        expect(jsonResult).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              body: "World",
              "Breaking News": 1,
              Metro: 0,
              id: 2,
              url: "https://www.projects.browndailyherald.com/article/2022-03-01/second-world",
              isUid: 0,
              time: "2060-03-20T14:27:00.601256+00:00",
              title: "Second",
              "University News": 0,
              Sports: 0,
              "Arts and Culture": 0,
              "Science and Research": 0,
              "Opinions": 0,
            }),
          ])
        ); // ◄ Passes!
      },
    });
  });
});