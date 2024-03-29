import { getRepository, Repository } from "typeorm";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

import { Car } from "../entities/Car";

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }
  async updateAvailable(card_id: string, available: boolean): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ available })
      .where("id = :id")
      .setParameters({ id: card_id })
      .execute();
  }

  async create({
    id,
    name,
    description,
    brand,
    category_id,
    daily_rate,
    fine_amount,
    license_plate,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      id,
      name,
      description,
      brand,
      category_id,
      daily_rate,
      fine_amount,
      license_plate,
      specifications,
    });

    return this.repository.save(car);
  }

  async list(): Promise<Car[]> {
    return this.repository.find();
  }

  async findByName(name: string): Promise<Car> {
    return this.repository.findOne({
      name,
    });
  }

  findById(card_id: string): Promise<Car> {
    return this.repository.findOne(card_id);
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.repository.findOne({
      license_plate,
    });
  }

  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]> {
    const carsQuery = this.repository
      .createQueryBuilder("cars")
      .where("available = :available", { available: true });

    if (brand) {
      carsQuery.andWhere("cars.brand = :brand", { brand });
    }
    if (category_id) {
      carsQuery.andWhere("cars.category_id = :category_id", { category_id });
    }
    if (name) {
      carsQuery.andWhere("cars.name = :name", { name });
    }

    return carsQuery.getMany();
  }
}

export { CarsRepository };
