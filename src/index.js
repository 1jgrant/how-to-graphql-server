const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

// dummy data
let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => {
      return links.filter((link) => link.id === args.id)[0];
    },
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      const index = links.findIndex((element) => element.id === args.id);
      const newLink = { ...args };
      links.splice(index, 1, newLink);
      return newLink;
    },
    deleteLink: (parent, args) => {
      const index = links.findIndex((element) => element.id === args.id);
      return links.splice(index, 1)[0];
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
