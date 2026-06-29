import { test, expect } from "@playwright/test";

//Get a single product by ID
//Get a single product by slug
//Create a product
//Update a product
//Delete a product
//Pagination
//Get products related by id -
//Get products related by slug -
//test headers -

//Get a single product by ID
test("get product by id - should be succeful", async ({ request }) => {
  //Arrange
  const radomNumber = Math.floor(Math.random() * 1_000_000);
  const uniqueTitle = "New Product" + radomNumber;
  const responseCreate = await request.post("api/v1/products/", {
    data: {
      title: uniqueTitle,
      price: 10,
      description: "A description",
      categoryId: 1,
      images: ["https://placehold.co/600x400"],
    },
    failOnStatusCode: true,
  });
  let jsonCreate = await responseCreate.json();
  const productId = jsonCreate.id;

  //Act
  const responseGet = await request.get(`/api/v1/products/${productId}`, {
    failOnStatusCode: true,
  });
  const jsonGet = await responseGet.json();

  //Assert
  expect(jsonGet).toHaveProperty("title", uniqueTitle);
  expect(jsonGet).toHaveProperty("price", 10);
  expect(jsonGet).toHaveProperty("description", "A description");
  expect(jsonGet).toHaveProperty("images", ["https://placehold.co/600x400"]);
  expect(jsonGet).toHaveProperty("category.id", 1);
});

//Get a single product by slug
test("get product by slug - should be succeful", async ({ request }) => {
  //Arrange
  const radomNumber = Math.floor(Math.random() * 1_000_000);
  const uniqueTitle = "A new Product" + radomNumber;
  const responseCreate = await request.post("api/v1/products/", {
    data: {
      title: uniqueTitle,
      price: 10,
      description: "A description",
      categoryId: 1,
      images: ["https://placehold.co/600x400"],
    },
    failOnStatusCode: true,
  });
  let jsonCreate = await responseCreate.json();
  const productSlug = jsonCreate.slug;

  //Act
  const responseGet = await request.get(
    `/api/v1/products/slug/${productSlug}`,
    {
      failOnStatusCode: true,
    },
  );
  const jsonGet = await responseGet.json();

  //Assert
  expect(jsonGet).toHaveProperty("title", uniqueTitle);
  expect(jsonGet).toHaveProperty("price", 10);
  expect(jsonGet).toHaveProperty("description", "A description");
  expect(jsonGet).toHaveProperty("images", ["https://placehold.co/600x400"]);
  expect(jsonGet).toHaveProperty("category.id", 1);
});

//Pagination
//Arrange
//Act
test("pagination - it should be successful", async ({ request }) => {
  const response = await request.get("/api/v1/products", {
    params: {
      offset: 0,
      limit: 10,
    },
  });
  //Assert
  expect(response).toBeOK();
  expect(response.status()).toBe(200);
});

//Create a product
test("create a product - should be successful", async ({ request }) => {
  //Arrange
  const radomNumber = Math.floor(Math.random() * 1_000_000);
  const uniqueTitle = "New Product" + radomNumber;

  //Act
  const responseCreate = await request.post("/api/v1/products/", {
    data: {
      title: uniqueTitle,
      price: 10,
      description: "A description",
      categoryId: 1,
      images: ["https://placehold.co/600x400"],
    },
    failOnStatusCode: true,
  });

  let jsonCreate = await responseCreate.json();
  const productId = jsonCreate.id;

  //Assert
  const responseGet = await request.get(`/api/v1/products/${productId}`, {
    failOnStatusCode: true,
  });
  const jsonGet = await responseGet.json();
  expect(jsonGet).toHaveProperty("title", uniqueTitle);
  expect(jsonGet).toHaveProperty("price", 10);
  expect(jsonGet).toHaveProperty("description", "A description");
  expect(jsonGet).toHaveProperty("images", ["https://placehold.co/600x400"]);
  expect(jsonGet).toHaveProperty("category.id", 1);
});

//Update product
test("update product - should be successful", async ({ request }) => {
  //Arrange
  const radomNumber = Math.floor(Math.random() * 1_000_000);
  const response = await request.post("/api/v1/products/", {
    data: {
      title: "New Product" + radomNumber,
      price: 10,
      description: "A description",
      categoryId: 1,
      images: ["https://placehold.co/600x400"],
    },
    failOnStatusCode: true,
  });

  const jsonCreate = await response.json();
  const productId = jsonCreate.id;
  const uniqueTitle = "Updated Product" + radomNumber;

  //Act
  await request.put(`/api/v1/products/${productId}`, {
    data: {
      title: "Updated Product" + radomNumber,
      price: 200,
      description: "A description",
      categoryId: 1,
      images: ["https://placehold.co/600x400"],
    },
  });

  //Expect
  const responseGet = await request.get(`/api/v1/products/${productId}`, {
    failOnStatusCode: true,
  });
  const jsonGet = await responseGet.json();

  expect(jsonGet).toHaveProperty("title", uniqueTitle);
  expect(jsonGet).toHaveProperty("price", 200);
  expect(jsonGet).toHaveProperty("description", "A description");
  expect(jsonGet).toHaveProperty("images", ["https://placehold.co/600x400"]);
  expect(jsonGet).toHaveProperty("category.id", 1);
});

//Delete product
test("delete product - should be successful", async ({ request }) => {
  //Arrange
  const radomNumber = Math.floor(Math.random() * 1_000_000);
  const response = await request.post("/api/v1/products/", {
    data: {
      title: "New Product" + radomNumber,
      price: 10,
      description: "A description",
      categoryId: 1,
      images: ["https://placehold.co/600x400"],
    },
    failOnStatusCode: true,
  });

  const json = await response.json();
  const productId = json.id;

  //Act
  const responseDeleted = await request.delete(`/api/v1/products/${productId}`);

  //Assert
  expect(responseDeleted.status()).toBe(200);
  const responseGetDeletedProduct = await request.get(
    `/api/v1/products/${productId}`,
    { failOnStatusCode: false },
  );

  expect(responseGetDeletedProduct.status()).toBe(404);
});

//Get Products related by id
test("Get products related by id - should be successful", async ({
  request,
}) => {
  const radomNumber = Math.floor(Math.random() * 1_000_000);
  const response = await request.post("/api/v1/products/", {
    data: {
      title: "New Product" + radomNumber,
      price: 10,
      description: "A description",
      categoryId: 1,
      images: ["https://placehold.co/600x400"],
    },
    failOnStatusCode: true,
  });

  const json = await response.json();
  const productId = json.id;
  //Arrange

  //Act
  const relatedProduct = await request.get(
    `/api/v1/products/${productId}/related`,
  );

  //Assert
  const relatedJson = await relatedProduct.json();
  expect(relatedJson.length).toBeGreaterThan(0);
  expect(relatedJson.every((product) => product.id !== productId)).toBeTruthy;
  expect(relatedProduct.status()).toBe(200);
});

//Get Products related by slug
test("Get products related by slug - should be successful", async ({
  request,
}) => {
  const radomNumber = Math.floor(Math.random() * 1_000_000);
  const response = await request.post("/api/v1/products/", {
    data: {
      title: "New Product" + radomNumber,
      price: 10,
      description: "A description",
      categoryId: 1,
      images: ["https://placehold.co/600x400"],
    },
    failOnStatusCode: true,
  });

  const json = await response.json();
  const productSlug = json.slug;
  //Arrange

  //Act
  const relatedProduct = await request.get(
    `/api/v1/products/slug/${productSlug}/related`,
  );

  //Assert
  const relatedJson = await relatedProduct.json();
  expect(relatedJson.length).toBeGreaterThan(0);
  expect(relatedJson.every((product) => product.slug !== productSlug))
    .toBeTruthy;
  expect(relatedProduct.status()).toBe(200);
});
