const { Client } = require("@notionhq/client");

const Etype = {
  TITLE: "title",
  WISH: "wish",
  FROM: "from",
};

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function getDatabases() {
  const response = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID,
  });
  console.log(response);
}

async function createWish({ title, wish, from }) {
  const res = await notion.pages.create({
    parent: {
      database_id: process.env.NOTION_DATABASE_ID,
    },
    properties: {
      [process.env.NOTION_TITLE_ID]: {
        title: [
          {
            type: "text",
            text: {
              content: title,
            },
          },
        ],
      },
      [process.env.NOTION_WISH_ID]: {
        rich_text: [
          {
            text: {
              content: wish,
            },
          },
        ],
      },
      [process.env.NOTION_FROM_ID]: {
        rich_text: [
          {
            text: {
              content: from,
            },
          },
        ],
      },
    },
  });
  return res;
}

async function getWishes() {
  let wishes = [];
  const notionPages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  const temp = await Promise.all(
    notionPages.results.map(async (item) => {
      const wish = await buildWish(item.id);
      wishes.push(wish);
    })
  );
  return wishes;
}

async function getPropertyDetail({ pageId, propertyId, type }) {
  const resp = await notion.pages.properties.retrieve({
    page_id: pageId,
    property_id: propertyId,
  });

  switch (type) {
    case Etype.TITLE:
      return resp.results[0].title.plain_text;
    default:
      return resp.results[0].rich_text.plain_text;
  }
}

async function buildWish(pageId) {
  return {
    title: await getPropertyDetail({
      pageId: pageId,
      propertyId: process.env.NOTION_TITLE_ID,
      type: Etype.TITLE,
    }),
    wish: await getPropertyDetail({
      pageId: pageId,
      propertyId: process.env.NOTION_WISH_ID,
      type: Etype.WISH,
    }),
    from: await getPropertyDetail({
      pageId: pageId,
      propertyId: process.env.NOTION_FROM_ID,
      type: Etype.FROM,
    }),
  };
}

async function archiveWish({ pageId }) {
  return (resp = await notion.pages.update({
    page_id: pageId,
    archived: true,
  }));
}

// createWish({ title: "aha", wish: "aha", from: "aha" });
// getWishes();

module.exports = {
  createWish,
  getWishes,
  archiveWish,
};
