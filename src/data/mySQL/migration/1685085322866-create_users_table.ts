import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1685085322866 implements MigrationInterface {
    name = 'CreateUsersTable1685085322866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`createdBy\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedBy\` text NOT NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` text NOT NULL, \`deletedAt\` datetime(6) NULL, \`email\` varchar(500) NOT NULL, \`name\` text NOT NULL, \`phone\` text NOT NULL, \`address\` varchar(500) NULL, \`role\` text NOT NULL, \`location\` enum ('us-east-1', 'ca-central-1') NOT NULL, INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`item\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`item\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
