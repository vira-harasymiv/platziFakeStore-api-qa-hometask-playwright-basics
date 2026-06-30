import { test, expect } from "@playwright/test";

function getRandomNumber() {
  return Math.floor(Math.random() * 100000);
}

//Get a single product by ID
test("get product by id - should be succeful", async ({ request }) => {
  // Arrange — підготовка даних
  const uniqueTitle = "New Product" + getRandomNumber();
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

  // Act — головна дія, яку перевіряємо
  const responseGet = await request.get(`/api/v1/products/${productId}`, {
    failOnStatusCode: true,
  });
  const jsonGet = await responseGet.json();
  const headers = responseGet.headers();

  // Assert — перевірка, що дія відпрацювала як треба
  expect(responseGet).toBeOK();
  expect(responseGet.status()).toBe(200);
  expect(responseGet.statusText()).toBe("OK");
  expect(jsonGet).toMatchObject(jsonCreate);
  expect(headers["content-type"]).toContain("application/json");
  expect(headers["access-control-allow-origin"]).toBe("*");
  expect(headers).toHaveProperty("date");
  // expect(jsonGet).toHaveProperty("title", uniqueTitle);
  // expect(jsonGet).toHaveProperty("price", 10);
  // expect(jsonGet).toHaveProperty("description", "A description");
  // expect(jsonGet).toHaveProperty("images", ["https://placehold.co/600x400"]);
  // expect(jsonGet).toHaveProperty("category.id", 1);
});

//Get a single product by slug
test("get product by slug - should be succeful", async ({ request }) => {
  //Arrange
  const uniqueTitle = "A new Product" + getRandomNumber();
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
  const headers = responseGet.headers();

  //Assert
  expect(responseGet).toBeOK();
  expect(responseGet.status()).toBe(200);
  expect(responseGet.statusText()).toBe("OK");
  expect(jsonGet).toMatchObject(jsonCreate);
  expect(headers["access-control-allow-origin"]).toBe("*");
  expect(headers["content-type"]).toContain("application/json");
  expect(headers).toHaveProperty("date");
  // expect(jsonGet).toHaveProperty("title", uniqueTitle);
  // expect(jsonGet).toHaveProperty("price", 10);
  // expect(jsonGet).toHaveProperty("description", "A description");
  // expect(jsonGet).toHaveProperty("images", ["https://placehold.co/600x400"]);
  // expect(jsonGet).toHaveProperty("category.id", 1);
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
  expect(response.statusText()).toBe("OK");
  const headers = response.headers();
  expect(headers["access-control-allow-origin"]).toBe("*");
  expect(headers["content-type"]).toContain("application/json");
  expect(headers).toHaveProperty("date");
});

//Create a product
test("create a product - should be successful", async ({ request }) => {
  //Arrange
  const uniqueTitle = "New created Product" + getRandomNumber();

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
  expect(responseCreate).toBeOK();
  expect(responseCreate.status()).toBe(201);
  expect(responseCreate.statusText()).toBe("Created");
  const responseGet = await request.get(`/api/v1/products/${productId}`, {
    failOnStatusCode: true,
  });
  const jsonGet = await responseGet.json();
  expect(jsonGet).toMatchObject(jsonCreate);
  const headers = responseCreate.headers();
  expect(headers["access-control-allow-origin"]).toBe("*");
  expect(headers["content-type"]).toContain("application/json");
  expect(headers).toHaveProperty("date");
  // expect(jsonGet).toHaveProperty("title", uniqueTitle);
  // expect(jsonGet).toHaveProperty("price", 10);
  // expect(jsonGet).toHaveProperty("description", "A description");
  // expect(jsonGet).toHaveProperty("images", ["https://placehold.co/600x400"]);
  // expect(jsonGet).toHaveProperty("category.id", 1);
});

//Update product
test("update product - should be successful", async ({ request }) => {
  //Arrange
  const response = await request.post("/api/v1/products/", {
    data: {
      title: "New Product to update" + getRandomNumber(),
      price: 10,
      description: "A description",
      categoryId: 1,
      images: ["https://placehold.co/600x400"],
    },
    failOnStatusCode: true,
  });

  const jsonCreate = await response.json();
  const productId = jsonCreate.id;

  //Act
  const updatedProduct = await request.put(`/api/v1/products/${productId}`, {
    data: {
      title: "Updated Product" + getRandomNumber(),
      price: 200,
      description: "A description",
      categoryId: 1,
      images: ["https://placehold.co/600x400"],
    },
  });

  //Expect
  const updatedJson = await updatedProduct.json();
  expect(updatedProduct).toBeOK();
  expect(updatedProduct.status()).toBe(200);
  expect(updatedProduct.statusText()).toBe("OK");
  const responseGet = await request.get(`/api/v1/products/${productId}`, {
    failOnStatusCode: true,
  });
  const jsonGet = await responseGet.json();
  expect(jsonGet).toMatchObject(updatedJson);
  const headers = updatedProduct.headers();
  expect(headers["access-control-allow-origin"]).toBe("*");
  expect(headers["content-type"]).toContain("application/json");
  expect(headers).toHaveProperty("date");

  // expect(jsonGet).toHaveProperty("title", uniqueTitle);
  // expect(jsonGet).toHaveProperty("price", 200);
  // expect(jsonGet).toHaveProperty("description", "A description");
  // expect(jsonGet).toHaveProperty("images", ["https://placehold.co/600x400"]);
  // expect(jsonGet).toHaveProperty("category.id", 1);
});

//Delete product
test("delete product - should be successful", async ({ request }) => {
  //Arrange
  const response = await request.post("/api/v1/products/", {
    data: {
      title: "New Product" + getRandomNumber(),
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
  expect(responseDeleted).toBeOK();
  expect(responseDeleted.status()).toBe(200);
  expect(responseDeleted.statusText()).toBe("OK");
  const responseGetDeletedProduct = await request.get(
    `/api/v1/products/${productId}`,
    { failOnStatusCode: false },
  );

  expect(responseGetDeletedProduct.status()).toBe(404);
  const headers = responseDeleted.headers();
  expect(headers["access-control-allow-origin"]).toBe("*");
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
  expect(relatedProduct).toBeOK();
  expect(relatedProduct.status()).toBe(200);
  expect(relatedProduct.statusText()).toBe("OK");
  expect(relatedJson.length).toBeGreaterThan(0);
  expect(relatedJson.every((product) => product.id !== productId)).toBeTruthy;
  expect(relatedProduct.status()).toBe(200);
  const headers = relatedProduct.headers();
  expect(headers["access-control-allow-origin"]).toBe("*");
  expect(headers["content-type"]).toContain("application/json");
  expect(headers).toHaveProperty("date");
});

//Get Products related by slug
test("Get products related by slug - should be successful", async ({
  request,
}) => {
  const response = await request.post("/api/v1/products/", {
    data: {
      title: "New Product" + getRandomNumber(),
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
  expect(relatedProduct).toBeOK();
  expect(relatedProduct.status()).toBe(200);
  expect(relatedProduct.statusText()).toBe("OK");
  const relatedJson = await relatedProduct.json();
  expect(relatedJson.length).toBeGreaterThan(0);
  expect(relatedJson.every((product) => product.slug !== productSlug))
    .toBeTruthy;
  expect(relatedProduct.status()).toBe(200);
  const headers = relatedProduct.headers();
  expect(headers["access-control-allow-origin"]).toBe("*");
  expect(headers["content-type"]).toContain("application/json");
  expect(headers).toHaveProperty("date");
});

//Create product without title
test("create product without title - it should not be successful", async ({
  request,
}) => {
  //Arrange
  //Act
  const response = await request.post("/api/v1/products/", {
    data: {
      price: 10,
      description: "A description",
      categoryId: 1,
      images: ["https://placehold.co/600x400"],
    },
    failOnStatusCode: false,
  });

  //Assert
  expect(response.status()).toBe(400);
});
