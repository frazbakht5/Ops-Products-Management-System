import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { ProductOwner } from "../modules/product-owners/product-owner.entity";
import { logger } from "../logger";

const productOwners: Array<{ name: string; email: string; phone: string }> = [
  { name: "Alice Johnson", email: "alice.johnson@example.com", phone: "+1-555-0101" },
  { name: "Bob Smith", email: "bob.smith@example.com", phone: "+1-555-0102" },
  { name: "Carol Williams", email: "carol.williams@example.com", phone: "+1-555-0103" },
  { name: "David Brown", email: "david.brown@example.com", phone: "+1-555-0104" },
  { name: "Eva Martinez", email: "eva.martinez@example.com", phone: "+1-555-0105" },
];

async function seed() {
  try {
    await AppDataSource.initialize();
    logger.info("Database connected for seeding");

    const repo = AppDataSource.getRepository(ProductOwner);

    await repo.upsert(productOwners, {
      conflictPaths: ["email"],
      skipUpdateIfNoValuesChanged: true,
    });

    logger.info(`Seeded ${productOwners.length} product owners successfully`);
  } catch (error) {
    logger.error("Seeding failed", { error });
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    process.exit(0);
  }
}

seed();
