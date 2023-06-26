import { Item } from '@data/mySQL/models/item.schema.model';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class ItemsSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Item);
    await repository.insert([
      {
        name: 'item name1',
      },
      {
        description: 'item description1',
      },
      {
        price: 250,
      },
    ]);
    return;
  }
}
