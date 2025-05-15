import { faker } from '@faker-js/faker';
import { createHash } from '../utils/hash.js';

const generateMockProducts = () => ({
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    department: faker.commerce.department(),
    stock: parseInt(faker.string.numeric()),
    id: faker.database.mongodbObjectId(),
    thumbnail: faker.image.url(),
});

export const generateMockUser = async (numberOfProducts) => {
    const cart = [];

    for (let i = 0; i < numberOfProducts; i++) {
        cart.push(generateMockProducts());
    }

    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 80 }),
        password: await createHash("coder123", 10),
        role: faker.helpers.arrayElement(["user", "admin"]),
        cart,
    };
};
