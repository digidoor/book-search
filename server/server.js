const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
//const routes = require('./routes'); // rendered inutile
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

const PORT = process.env.PORT || 3001; // order is swtiched in everything I've seen
const app = express();
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: authMiddleware,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) =>
{
	res.sendFile(path.join(__dirname, '../client/'));
});
//app.use(routes); //verbotten now

const startApolloServer = async () =>
{
	await server.start();
	server.applyMiddleware({app});
	db.conce('open', () =>
	{
		app.listen(PORT, () => { console.log(`API on ${PORT} and graphql on ${PATH}${server.graphqlPath}`) } );
	});
};

startApolloServer();
//now verboten
// db.once('open', () => {
// 	app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });
