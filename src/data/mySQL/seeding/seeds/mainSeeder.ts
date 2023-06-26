import { DataSource } from 'typeorm';
import { runSeeder, Seeder } from 'typeorm-extension';
import ItemsSeeder from './itemsSeed';

export class MainSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    console.log('MainSeeder running.........');

    console.log('dataSource', dataSource);
    console.log('ItemsSeeder', ItemsSeeder);

    await dataSource.initialize();

    await runSeeder(dataSource, ItemsSeeder);
  }
}