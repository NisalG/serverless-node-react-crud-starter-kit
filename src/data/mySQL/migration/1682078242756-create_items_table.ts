import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateItemsTable1682078242756 implements MigrationInterface {
    name = 'CreateItemsTable1682078242756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`item\` (\`id\` varchar(36) NOT NULL, \`createdBy\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedBy\` text NOT NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` text NOT NULL, \`deletedAt\` datetime(6) NULL, \`name\` text NOT NULL, \`description\` text NOT NULL, \`price\` double NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`item\``);
    }

}
