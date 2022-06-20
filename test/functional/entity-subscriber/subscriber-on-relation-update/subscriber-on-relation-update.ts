import {
    Connection,
} from "../../../../src";
import {closeTestingConnections, createTestingConnections} from "../../../utils/test-utils";
import {expect} from "chai";
import { Post } from "./entity/Post";
import { Category } from "./entity/Category";
import { MockSubscriber } from "./subscribers/MockSubscriber";


describe("entity subscriber > subscriber on relation update", () => {
	let connections: Connection[];

	before(async () => connections = await createTestingConnections({
		entities: [ Category, Post ],
		subscribers: [ MockSubscriber ],
		dropSchema: true,
		schemaCreate: true,
		enabledDrivers: [ "mariadb" ]
	}));

	beforeEach(() => {
		for (const connection of connections) {
		    (connection.subscribers[0] as MockSubscriber).reset();
		}
	});
	after(() => closeTestingConnections(connections));

	it("subscriber is called on relation update", async () => {
		const connection = connections[0];
		const subscriber = connection.subscribers[0] as MockSubscriber;		

		// prepare
		const category = new Category();
		const post1 = new Post();
		category.name = "test category";
		post1.title = "Test post";
		category.posts = [post1];
		const persistedCat = await connection.manager.save(category);

		// now run the update that should trigger the afterUpdate subscriber
		const post2 = new Post();
		post2.title = "Additional post";
		persistedCat.posts.push(post2);	

		// persistedCat.name = "Other title"; // when uncommenting the name update, change will be detected + subscriber will be called
		await connection.manager.save(persistedCat);

		// fails because subscriber has not been called
		expect(subscriber.count).to.be.eql(1);
		
	});

});
