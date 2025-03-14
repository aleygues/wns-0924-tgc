import "reflect-metadata";
import { IdInput } from "../../src/entities/Id";
import { merge } from "../../src/utils/merge";

describe("how merge function works", () => {
  it("should do nothing", () => {
    const originalCategoryRelation = { id: 12 };
    const entity = {
      name: "Super ad",
      price: 100,
      category: originalCategoryRelation,
    };
    const categoryRelation = new IdInput();
    categoryRelation.id = 12;
    const data = {
      name: "Super ad",
      price: 100,
      category: categoryRelation,
    };
    merge(entity, data);
    expect(entity.category === categoryRelation).toBe(true);
  });
  it("should update the n-n relation but using old one", () => {
    const originalTag1 = { id: 12 };
    const originalTag2 = { id: 13 };
    const entity = {
      name: "Super ad",
      price: 100,
      tags: [originalTag1, originalTag2],
    };
    const updateTag2 = new IdInput();
    updateTag2.id = 13;
    const updateTag3 = new IdInput();
    updateTag3.id = 14;
    const data = {
      name: "Super ad",
      price: 100,
      tags: [updateTag2, updateTag3],
    };
    merge(entity, data);
    expect(entity.tags[0] === originalTag2).toBe(true);
    expect(entity.tags[1] === updateTag3).toBe(true);
  });
});
