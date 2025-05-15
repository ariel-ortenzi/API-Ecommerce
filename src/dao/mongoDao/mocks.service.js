import { generateMockUser } from '../../controllers/mocks.controller.js';

export const generateMockUsersWithProducts = async (userCount, productsPerUser) => {
    const users = await Promise.all(
        Array.from({ length: userCount }, () => generateMockUser(productsPerUser))
    );
    return users;
};
